// routes/blogRoutes.js
const express = require("express");
const { createBlogPost, upload,deleteBlogPost,getUserBlogs,updateBlogPost, 
    getAllBlogs, updateBlogStatus, fetchBlogById ,getBlogsByUserId,
getAllBlogsstatusAprroved,getBlogsByUserIdandstaus} 
    = require("../controllers/blogController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, upload.single("blogImage"), createBlogPost);
router.delete("/:id", authMiddleware, deleteBlogPost); 
router.get("/user-blogs", authMiddleware,getUserBlogs);
router.put("/update/:id", authMiddleware, upload.single("blogImage"), updateBlogPost);
router.get("/all-blogs",getAllBlogs); 
router.get("/statusapproved-blogs",getAllBlogsstatusAprroved); 
router.put('/update-status/:id', updateBlogStatus);
router.get("/getblogbyid/:id",fetchBlogById); 
router.get('/blogs/user/:userId', getBlogsByUserId);
router.get('/blogs/userstatus/:userId', getBlogsByUserIdandstaus);




module.exports = router;
