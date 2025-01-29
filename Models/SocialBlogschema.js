const mongoose = require('mongoose');

const socialBlogSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  comments: [{ 
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('SocialBlog', socialBlogSchema);
