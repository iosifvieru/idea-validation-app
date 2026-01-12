import { useState, useEffect } from "react";
import CommentCard from "../CommentCard/CommentCard";
import "./IdeaCard.css";

export default function IdeaCard({
  idea,
  onViewIdea,
  onUpvote,
  onDownvote,
  onAddComment,
  onCommentUpVote,
  onCommentDownVote
}) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(idea.comments.items);
  }, [idea.comments.items]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    onAddComment?.(idea.id, newComment);

    const localComment = {
      id: Date.now(),
      author: "You",
      content: newComment,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      createdAt: new Date().toISOString(),
    };

    setComments([localComment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="idea-card">
      <div className="idea-card-header">
        <div className="idea-card-main">
          <h2 className="idea-card-title">{idea.title}</h2>
          <p className="idea-card-content">{idea.content}</p>
          <p className="idea-card-author">By {idea.author}</p>
        </div>

        <div className="idea-card-stats">
          <p>💬 {idea.commentsCount}</p>
        </div>
      </div>

      <div className="idea-card-votes">
        <button className="vote-button" onClick={() => onUpvote?.(idea.id)}>
          ▲ {idea.upvotes}
        </button>
        <button className="vote-button" onClick={() => onDownvote?.(idea.id)}>
          ▼ {idea.downvotes}
        </button>
      </div>

      <div className="idea-card-comments">
        {comments.map((comment) => (
          <CommentCard 
              key={comment.id} 
              comment={comment}
              handleUpVote={onCommentUpVote}
              handleDownVote={onCommentDownVote} 
          />
        ))}
      </div>

      <div className="idea-card-add-comment">
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="comment-submit-button" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>

      <button
        className="idea-card-view-button"
        onClick={() => onViewIdea(idea.id)}
      >
        View Full Post
      </button>
    </div>
  );
}
