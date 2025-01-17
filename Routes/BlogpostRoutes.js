// routes/blogRoutes.js
const express = require("express");
const { createBlogPost, upload,deleteBlogPost,getUserBlogs,updateBlogPost, getAllBlogs, updateBlogStatus, fetchBlogById } = require("../controllers/blogController");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, upload.single("blogImage"), createBlogPost);
router.delete("/:id", authMiddleware, deleteBlogPost); 
router.get("/user-blogs", authMiddleware, getUserBlogs);
router.put("/update/:id", authMiddleware, upload.single("blogImage"), updateBlogPost);
router.get("/all-blogs", authMiddleware,getAllBlogs); 
router.put('/update-status/:id',authMiddleware, updateBlogStatus);
router.get("/getblogbyid/:id", authMiddleware,fetchBlogById); 


module.exports = router;
