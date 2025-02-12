const BlogPost = require("../Models/blogpostModel");
const multer = require("multer");
const path = require("path");
const Joi = require("joi"); 
const mongoose = require("mongoose");


const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png) are allowed"));
    }
  },
});


const validateBlogPost = (data) => {
  const schema = Joi.object({
    blogName: Joi.string().required(),
    blogAuthor: Joi.string().required(),
    blogDescription: Joi.string().required(),
    category: Joi.string().required(),
  });
  return schema.validate(data);
};

// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { error } = validateBlogPost(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { blogName, blogAuthor, blogDescription, category } = req.body;
    const blogImage = req.file ? req.file.path : null;
    const userId = req.user.userId;

    const newBlogPost = new BlogPost({
      blogName,
      blogAuthor,
      blogDescription,
      blogImage,
      category,
      uploadedBy: { id: userId },
    });

    await newBlogPost.save();
    res.status(201).json({ message: "Blog post created successfully", blog: newBlogPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog post", error: error.message });
  }
};

// Delete a blog post
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlogPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog post", error: error.message });
  }
};


const getUserBlogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query; 

    const userBlogs = await BlogPost.find({ "uploadedBy.id": userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!userBlogs || userBlogs.length === 0) {
      return res.status(404).json({ message: "No blog posts found for this user" });
    }

    res.status(200).json({ blogs: userBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog posts", error: error.message });
  }
};




// Update a blog post
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogName, blogAuthor, blogDescription, category } = req.body;
    const blogImage = req.file ? req.file.path : null;
    const userId = req.user.userId;

    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // if (blogPost.uploadedBy.id.toString() !== userId) {
    //   return res.status(403).json({ message: "You are not authorized to edit this blog post" });
    // }

    blogPost.blogName = blogName || blogPost.blogName;
    blogPost.blogAuthor = blogAuthor || blogPost.blogAuthor;
    blogPost.blogDescription = blogDescription || blogPost.blogDescription;
    blogPost.category = category || blogPost.category;

    if (blogImage) {
      blogPost.blogImage = blogImage;
    }

    await blogPost.save();
    res.status(200).json({ message: "Blog post updated successfully", blog: blogPost });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog post", error: error.message });
  }
};

// Get all blogs with pagination
const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await BlogPost.find();

    if (!allBlogs || allBlogs.length === 0) {
      return res.status(404).json({ message: "No blog posts found" });
    }

    res.status(200).json({ blogs: allBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog posts", error: error.message });
  }
};

const getAllBlogsstatusAprroved = async (req, res) => {
  try {
    const approvedBlogs = await BlogPost.find({ blogStatus: "Approved" });

    if (!approvedBlogs || approvedBlogs.length === 0) {
      return res.status(404).json({ message: "No approved blog posts found" });
    }

    res.status(200).json({ blogs: approvedBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving approved blog posts", error: error.message });
  }
};





//Update Blog Status by id 

const updateBlogStatus = async (req, res) => {
  try {
      const { id } = req.params; 
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid blog post ID" });
      }

      const { blogStatus } = req.body;
      const validStatuses = ['Approved', 'Rejected', 'Pending'];
      if (!validStatuses.includes(blogStatus)) {
          return res.status(400).json({ message: "Invalid blog status" });
      }

      const blogPost = await BlogPost.findById(id);

      if (!blogPost) {
          return res.status(404).json({ message: "Blog post not found" });
      }

  
      blogPost.blogStatus = blogStatus;
      await blogPost.save();

      res.status(200).json({ message: "Blog status updated successfully", blog: blogPost });
  } catch (error) {
      res.status(500).json({ message: "Error updating blog status", error: error.message });
  }
};

const fetchBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Blog ID format" });
    }

    const blog = await BlogPost.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post retrieved successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog post", error: error.message });
  }
};

const getBlogsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userBlogs = await BlogPost.find({ "uploadedBy.id": userId });

    if (!userBlogs || userBlogs.length === 0) {
      return res.status(404).json({ message: "No blog posts found for this user" });
    }

    res.status(200).json({ message: "Blogs retrieved successfully", blogs: userBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error: error.message });
  }
};

const getBlogsByUserIdandstaus = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userBlogs = await BlogPost.find({ 
      "uploadedBy.id": userId, 
      blogStatus: "Approved" 
    });

    if (!userBlogs || userBlogs.length === 0) {
      return res.status(404).json({ message: "No approved blog posts found for this user" });
    }

    res.status(200).json({ message: "Approved blogs retrieved successfully", blogs: userBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error: error.message });
  }
};





module.exports = {
  createBlogPost,
  upload,
  deleteBlogPost,
  getUserBlogs,
  updateBlogPost,
  getAllBlogs,
  updateBlogStatus,
  fetchBlogById,
  getBlogsByUserId,
  getAllBlogsstatusAprroved,
  getBlogsByUserIdandstaus
};
