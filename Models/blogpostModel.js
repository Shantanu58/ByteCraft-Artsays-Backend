const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  blogName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  blogAuthor: { type: String, required: true },
  blogDescription: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  blogImage: { type: String },
  uploadedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String }
  },
  blogStatus: {
    type: String,
    enum: ['Approved', 'Rejected', 'Pending'],
    default: 'Pending',
  },
  blogId: { type: String, unique: true },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
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

BlogPostSchema.index({
  blogName: 'text',
  blogDescription: 'text',
  summary: 'text',
  tags: 'text'
});

module.exports = mongoose.model("BlogPost", BlogPostSchema);