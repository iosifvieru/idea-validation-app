import React, { useEffect, useState } from "react";
import TopBar from "../../components/TopBar/TopBar";
import IdeaCard from "../../components/IdeaCard/IdeaCard";
import { graphqlFetch } from "../../utils/graphqlFetch";
import "./MainPage.css";
import { supabase } from "../../auth/supabaseClient";

const GET_IDEAS_QUERY = `
query GetIdeas($page: Int = 1, $pageSize: Int = 10) {
  ideas(page: $page, pageSize: $pageSize) {
    items {
      id
      author
      title
      content
      upvotes
      downvotes
      commentsCount
      createdAt
      comments(page: 1, pageSize: 3) {
        items {
          id
          author
          content
          upvotes
          downvotes
          score
          createdAt
        }
      }
    }
    meta {
      totalItems
      hasNextPage
    }
  }
}
`;

const VOTE_IDEA_MUTATION = `
mutation VoteIdea($id: ID!, $value: Int!) {
  voteIdea(id: $id, value: $value) {
    id
    upvotes
    downvotes
    score
  }
}
`;

const CREATE_IDEA_MUTATION = `
mutation CreateIdea($title: String!, $content: String!) {
  createIdea(title: $title, content: $content) {
    id
    title
    content
    author
    upvotes
    downvotes
    commentsCount
    createdAt
    comments(page: 1, pageSize: 3) {
      items {
        id
        author
        content
        upvotes
        downvotes
        score
        createdAt
      }
    }
  }
}
`;

export default function MainPage({user, token}) {
  const [ideas, setIdeas] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalItems: 0, hasNextPage: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sort, setSort] = useState("NEW");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterContent, setFilterContent] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posting, setPosting] = useState(false);

  const loadIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlFetch(GET_IDEAS_QUERY, { page, pageSize: 10 });
      setIdeas(data.ideas.items);
      setMeta(data.ideas.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, [page]);

  const handleLogout = () => supabase.auth.signOut();
  const handleViewIdea = (id) => console.log("View idea:", id);

  const handleVote = async(id, value) => {
    setError(null);
    try {
      const data = await graphqlFetch(VOTE_IDEA_MUTATION, { id, value }, token);
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, upvotes: data.voteIdea.upvotes, downvotes: data.voteIdea.downvotes } : i
        )
      );
    } catch (err) {
      setError(err.message);
    } 
  }

  const handleUpvote = (id) => handleVote(id, 1);
  const handleDownvote = (id) => handleVote(id, -1);

  const handleCreateIdea = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    setPosting(true);
    setError(null);

    try {
      const data = await graphqlFetch(
        CREATE_IDEA_MUTATION,
        { title: newTitle, content: newContent },
        token
      );

      setIdeas((prev) => [data.createIdea, ...prev]);

      setNewTitle("");
      setNewContent("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const filteredAndSortedIdeas = ideas
    .filter((idea) =>
      (filterAuthor ? idea.author.toLowerCase().includes(filterAuthor.toLowerCase()) : true) &&
      (filterContent ? idea.content.toLowerCase().includes(filterContent.toLowerCase()) : true)
    )
    .sort((a, b) => {
      if (sort === "NEW") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "TOP") return b.upvotes - a.upvotes;
      if (sort === "COMMENTS") return b.commentsCount - a.commentsCount;
      return 0;
    });

  return (
    <div className="main-page">
      <TopBar title="Idea Validator" userEmail={user} onLogout={handleLogout} />

      <div className="main-container">
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by author"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by content"
            value={filterContent}
            onChange={(e) => setFilterContent(e.target.value)}
            className="filter-input"
          />
          <button onClick={loadIdeas} className="filter-button">
            Apply
          </button>
        </div>

        <div className="sort-buttons">
          {["NEW", "TOP", "COMMENTS"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`sort-button ${sort === s ? "active" : ""}`}
            >
              {s === "NEW" ? "New" : s === "TOP" ? "Top" : "Most Comments"}
            </button>
          ))}
        </div>

        {loading && <p>Loading ideas...</p>}
        {error && <p className="error">{error}</p>}

        <div className="create-idea-box">
          <h3 className="create-idea-title">Create New Idea</h3>

          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="create-idea-input"
          />

          <textarea
            placeholder="Describe your idea..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            className="create-idea-textarea"
          />

          <div className="create-idea-actions">
            <button
              onClick={handleCreateIdea}
              disabled={posting}
              className="create-idea-button"
            >
              {posting ? "Posting..." : "Post Idea"}
            </button>
          </div>
        </div>

        {filteredAndSortedIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} onViewIdea={handleViewIdea} onUpvote={handleUpvote} onDownvote={handleDownvote} />
        ))}

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="pagination-button"
          >
            Prev
          </button>
          <span className="pagination-page">{page}</span>
          <button
            disabled={!meta.hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
