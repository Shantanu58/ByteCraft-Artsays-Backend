const express = require('express');
const router = express.Router();
const SocialBlog = require('../Models/SocialBlogschema'); // SocialBlog model

// Route to like a blog
router.post('/like-blog/:blogId', async (req, res) => {
  const { blogId } = req.params;

  try {
    // Find the social blog entry for the specific blog
    let socialEntry = await SocialBlog.findOne({ blogId });

    // If no social entry exists, create one
    if (!socialEntry) {
      socialEntry = new SocialBlog({ blogId, likeCount: 1, commentCount: 0, comments: [] });
    } else {
      // Increment like count
      socialEntry.likeCount += 1;
    }

    await socialEntry.save();
    res.status(200).json({ message: 'Blog liked successfully', socialEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error liking blog', error });
  }
});

// Route to comment on a blog
router.post('/comment-blog/:blogId', async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body; // Comment content

  try {
    // Find the social blog entry for the specific blog
    let socialEntry = await SocialBlog.findOne({ blogId });

    // If no social entry exists, create one
    if (!socialEntry) {
      socialEntry = new SocialBlog({
        blogId,
        likeCount: 0,
        commentCount: 1, // First comment
        comments: [{ content }], // Add the first comment
      });
    } else {
      // Add the new comment and increment the comment count
      socialEntry.comments.push({ content });
      socialEntry.commentCount += 1;
    }

    await socialEntry.save();
    res.status(200).json({ message: 'Comment added successfully', socialEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error commenting on blog', error });
  }
});

module.exports = router;
