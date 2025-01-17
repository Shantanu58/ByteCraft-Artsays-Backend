const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  blogName: { type: String, required: true },
  blogAuthor: { type: String, required: true },
  blogDescription: { type: String, required: true },
  category: { type: String, required: true },
  blogImage: { type: String },
  uploadedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  blogStatus: {
    type: String,
    enum: ['Approved', 'Rejected', 'Pending'],
    default: 'Pending',
  },
  blogId: { type: String, unique: true }, 
}, { timestamps: true });


BlogPostSchema.pre('save', async function (next) {
  if (this.isNew) {
    const BlogPost = mongoose.model('BlogPost');
    const lastBlog = await BlogPost.findOne().sort({ createdAt: -1 });
    const lastId = lastBlog ? lastBlog.blogId : null;

    let nextId = 'AR-01';
    if (lastId) {
      const [prefix, number] = lastId.split('-');
      const newNumber = String(parseInt(number) + 1).padStart(2, '0');
      nextId = `${prefix}-${newNumber}`;
    }

    this.blogId = nextId;
  }
  next();
});

module.exports = mongoose.model("BlogPost", BlogPostSchema);
