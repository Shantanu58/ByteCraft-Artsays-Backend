const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  blogCategory: { type: String, required: true },
  image: { type: Buffer }, // Assuming the image is stored as a buffer
  isAccepted: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
