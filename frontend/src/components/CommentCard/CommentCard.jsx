import "./CommentCard.css";

export default function CommentCard({ comment }) {
  return (
    <div className="comment-card">
      <div className="comment-card-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{new Date(Number(comment.createdAt)).toLocaleDateString()}</span>
      </div>
      <p className="comment-content">{comment.content}</p>
      <div className="comment-card-stats">
        <span>▲ {comment.upvotes}</span>
        <span>▼ {comment.downvotes}</span>
        <span>Score: {comment.score}</span>
      </div>
    </div>
  );
}
