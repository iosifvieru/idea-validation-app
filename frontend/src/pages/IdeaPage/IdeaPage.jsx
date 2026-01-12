import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBar from "../../components/TopBar/TopBar";
import "./IdeaPage.css";
import { useIdeaActions } from "../../hooks/useIdeaActions";
import CommentCard from "../../components/CommentCard/CommentCard";

export default function IdeaPage({ user, token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const {getIdea, updateIdea, deleteIdea, addComment} = useIdeaActions(token);

  const loadIdea = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIdea(id, page);
      setIdea(data.idea);
      setHasNext(data.idea.comments.meta.hasNextPage);

      if (!isEditing) {
        setEditTitle(data.idea.title);
        setEditContent(data.idea.content);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdea();
  }, [id, page]);

  const handleUpdateIdea = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    try {
      const data = await updateIdea(idea.id, editTitle, editContent);
      setIdea((prev) => ({ ...prev, ...data.updateIdea }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteIdea = async () => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;

    try {
      await deleteIdea(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVoteComment = async (commentId, value) => {
    alert("not implemented.");
  };

  const handleBack = () => {
    navigate(-1); 
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setPostingComment(true);
    setError(null);

    try {
        const data = await addComment(idea.id, newComment);

        setIdea((prev) => ({
        ...prev,
        comments: {
            ...prev.comments,
            items: [data.addComment, ...prev.comments.items],
        },
        }));

        setNewComment("");
    } catch (err) {
        setError(err.message);
    } finally {
        setPostingComment(false);
    }
  };

  const isOwner = user?.email === idea?.author;

  return (
    <div className="idea-page">
      <TopBar title="Idea Validator" userEmail={user} />

      <div className="idea-page-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        {idea && (
          <>
            <div className="idea-full-card">
              {isEditing ? (
                <div className="idea-edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="idea-edit-title"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="idea-edit-content"
                    rows={4}
                  />
                  <div className="idea-edit-actions">
                    <button onClick={handleUpdateIdea}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>{idea.title}</h2>
                  <p className="idea-author">by {idea.author}</p>
                  <p className="idea-content">{idea.content}</p>
                  <div className="idea-votes">
                    ▲ {idea.upvotes} | ▼ {idea.downvotes}
                  </div>
                </>
              )}

              {isOwner && !isEditing && (
                <div className="idea-actions">
                  <button onClick={() => setIsEditing(true)} title="Edit">✏️</button>
                  <button onClick={handleDeleteIdea} title="Delete">🗑</button>
                </div>
              )}

              <div className="add-comment-box">
                <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="comment-input"
                    rows={3}
                />
                <button
                    onClick={handleAddComment}
                    disabled={postingComment}
                    className="comment-submit-button"
                >
                    {postingComment ? "Posting..." : "Add Comment"}
                </button>
            </div>

            </div>

            <h3 className="comments-title">Comments</h3>

            {idea.comments.items.map((c) => (
              <div>
                <CommentCard key = {c.id} comment={c} 
                    handleDownVote={() => handleVoteComment(c.id, -1)}
                    handleUpVote = {() => handleVoteComment(c.id, 1)}    
                >
                </CommentCard>
              </div>
            ))}

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </button>
              <span>{page}</span>
              <button disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
