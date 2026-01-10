const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, minlength: 10 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

IdeaSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Idea', IdeaSchema);
