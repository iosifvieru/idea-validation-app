import "./CommentCard.css";

export default function CommentCard({ comment, handleUpVote, handleDownVote }) {
  return (
    <div className="comment-card">
      <div className="comment-card-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{new Date(Number(comment.createdAt)).toLocaleString()}</span>
      </div>
      <p className="comment-content">{comment.content}</p>

      <div className="comment-votes">
        <button onClick={handleUpVote}>▲</button>
        <span>{comment.upvotes}</span>
        <button onClick={handleDownVote}>▼</button>
        <span>{comment.downvotes}</span>
      </div>
    </div>
  );
}
