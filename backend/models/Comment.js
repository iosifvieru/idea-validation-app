const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true, index: true },
    author: { type: String, required: true, index: true },
    content: { type: String, required: true, minlength: 10 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
