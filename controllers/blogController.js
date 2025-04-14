const BlogPost = require("../Models/blogpostModel");
const  validateBlogPost = require("../Validators/Blog/Blog");
const User = require("../Models/usermode");
const multer = require("multer");
const path = require("path");
const Joi = require("joi"); 
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const EmailSetting = require("../Models/EmailSetting");
// const path = require("path");
const fs = require("fs");

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


// const validateBlogPost = (data) => {
//   const schema = Joi.object({
//     blogName: Joi.string().required(),
//     blogAuthor: Joi.string().required(),
//     blogDescription: Joi.string().required(),
//     category: Joi.string().required(),
//   });
//   return schema.validate(data);
// };

const sendBlogCreationEmail = async (userEmail, userName, blogTitle, blogStatus) => {
  try {
    const emailSettings = await EmailSetting.findOne();
    if (!emailSettings) {
      console.log("No email settings found in database");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.mailHost,
      port: emailSettings.mailPort,
      secure: emailSettings.mailEncryption === "SSL",
      auth: {
        user: emailSettings.mailUsername,
        pass: emailSettings.mailPassword,
      },
    });

    await transporter.verify();
    console.log("SMTP server is ready to send messages");

    // Prepare image attachment
    const imagePath = path.join(__dirname, "../controllers/Email/Artsays.png");
    let attachments = [];

    try {
      if (fs.existsSync(imagePath)) {
        attachments.push({
          filename: "artsays-logo.png",
          path: imagePath,
          cid: "artsays_logo",
        });
      } else {
        console.warn("Logo image not found at:", imagePath);
      }
    } catch (err) {
      console.error("Error checking image:", err);
    }

    const mailOptions = {
      from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
      to: userEmail,
      subject: `Your Blog "${blogTitle}" Has Been Created - Status: ${blogStatus}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    /* Base Styles */
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f7f9fc;
    }
    
    /* Email Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    /* Header Section */
    .header {
      background: linear-gradient(135deg, rgb(187, 125, 89) 0%, rgb(187, 125, 89) 100%);
      padding: 30px 20px;
      text-align: center;
      color: white;
    }
    
    .logo-container {
      margin-bottom: 20px;
    }
    
    .logo {
      width: 250px;
      height: auto;
    }
    
    .welcome-heading {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      color: black;
    }
    
    /* Content Section */
    .content {
      padding: 30px;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 25px;
      color: #2d3748;
    }
    
    .message {
      margin-bottom: 25px;
      font-size: 16px;
      color: #4a5568;
    }
    
    /* Blog Info Box */
    .blog-info-box {
      background: rgb(244, 236, 233);
      border-left: 4px solid rgb(173, 100, 73);
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    
    .blog-info-item {
      margin-bottom: 12px;
      display: flex;
    }
    
    .blog-info-label {
      font-weight: 600;
      min-width: 120px;
      color: #2d3748;
    }
    
    .blog-info-value {
      color: #4a5568;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      ${
        blogStatus === 'Approved' 
          ? 'background-color: #48bb78; color: white;' 
          : blogStatus === 'Pending' 
            ? 'background-color: #ed8936; color: white;' 
            : 'background-color: #f56565; color: white;'
      }
    }
    
    /* Action Button */
    .action-button {
      display: inline-block;
      background: rgb(173, 100, 73);
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background: rgb(244, 236, 233);
      font-size: 14px;
      color: #718096;
    }
    
    .signature {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #e2e8f0;
    }
    
    .support-text {
      margin-top: 20px;
      font-size: 15px;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .logo {
        width: 200px;
      }
      .content {
        padding: 20px;
      }
      .blog-info-item {
        flex-direction: column;
      }
      .blog-info-label {
        margin-bottom: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header with Logo -->
    <div class="header">
      <div class="logo-container">
        ${
          attachments.length > 0
            ? `<img src="cid:artsays_logo" alt="Artsays Logo" class="logo">`
            : ""
        }
      </div>
      <h1 class="welcome-heading">Blog Created Successfully</h1>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <p class="greeting">Dear ${userName},</p>
      
      <p class="message">Thank you for creating a new blog post on Artsays. Your blog has been successfully submitted!</p>
      
      <p class="message">Here are the details of your blog post:</p>
      
      <!-- Blog Info Box -->
      <div class="blog-info-box">
        <div class="blog-info-item">
          <span class="blog-info-label">Blog Title:</span>
          <span class="blog-info-value">${blogTitle}</span>
        </div>
        <div class="blog-info-item">
          <span class="blog-info-label">Status:</span>
          <span class="blog-info-value"><span class="status-badge">${blogStatus}</span></span>
        </div>
        <div class="blog-info-item">
          <span class="blog-info-label">Submitted On:</span>
          <span class="blog-info-value">${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>
      
      <p class="message">
        ${
          blogStatus === 'Approved' 
            ? 'Your blog has been approved and is now live on our platform!'
            : blogStatus === 'Pending'
              ? 'Your blog is under review by our team. You will be notified once it is approved.'
              : 'Your blog has been rejected. Please check the guidelines and submit again.'
        }
      </p>
      
      <!-- Action Button -->
      <div style="text-align: center;">
        <a href="http://localhost:3000/login" class="action-button">View Your Blogs</a>
      </div>
      
      <!-- Support Section -->
      <div class="support-text">
        <p>If you have any questions about your blog submission, please contact our support team.</p>
      </div>
      
      <!-- Signature -->
      <div class="signature">
        <p>Best regards,</p>
        <p><strong>The Artsays Team</strong></p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Blog creation email sent to ${userEmail}`);
  } catch (emailError) {
    console.error("Failed to send blog creation email:", {
      error: emailError.message,
      stack: emailError.stack,
    });
  }
};

const createBlogPost = async (req, res) => {
  try {
    const { error } = validateBlogPost(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        message: error.details[0].message 
      });
    }

    const { 
      blogName, 
      slug, 
      summary, 
      blogDescription, 
      category, 
      tags 
    } = req.body;
    
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const existingSlug = await BlogPost.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists, please choose a different one"
      });
    }

    const newBlogPost = new BlogPost({
      blogName,
      slug,
      summary,
      blogAuthor: user.name || user.username,
      blogDescription,
      category,
      tags: tags ? tags.split(',') : [],
      blogImage: req.file ? req.file.path : null,
      uploadedBy: { 
        id: userId,
        name: user.name || user.username
      }
    });

    await newBlogPost.save();
    
    // Send email notification if user has email
    if (user.email) {
      await sendBlogCreationEmail(
        user.email,
        user.name || user.username,
        newBlogPost.blogName,
        newBlogPost.blogStatus
      );
    }
    
    res.status(201).json({ 
      success: true,
      message: "Blog post created successfully", 
      data: newBlogPost 
    });
    
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating blog post", 
      error: error.message 
    });
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
    const { 
      blogName, 
      slug, 
      summary, 
      category, 
      tags,
      blogDescription 
    } = req.body;
    
    const blogImage = req.file ? req.file.path : null;
    const userId = req.user.userId;

    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

  
    blogPost.blogName = blogName || blogPost.blogName;
    blogPost.slug = slug || blogPost.slug;
    blogPost.summary = summary || blogPost.summary;
    blogPost.category = category || blogPost.category;
    blogPost.blogDescription = blogDescription || blogPost.blogDescription;

    if (tags) {
      blogPost.tags = typeof tags === 'string' ? tags.split(',') : tags;
    }

    if (blogImage) {
      blogPost.blogImage = blogImage;
    }

    await blogPost.save();
    
    res.status(200).json({ 
      message: "Blog post updated successfully", 
      blog: blogPost 
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ 
      message: "Error updating blog post", 
      error: error.message 
    });
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

// const updateBlogStatus = async (req, res) => {
//   try {
//       const { id } = req.params; 
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//           return res.status(400).json({ message: "Invalid blog post ID" });
//       }

//       const { blogStatus } = req.body;
//       const validStatuses = ['Approved', 'Rejected', 'Pending'];
//       if (!validStatuses.includes(blogStatus)) {
//           return res.status(400).json({ message: "Invalid blog status" });
//       }

//       const blogPost = await BlogPost.findById(id);

//       if (!blogPost) {
//           return res.status(404).json({ message: "Blog post not found" });
//       }

  
//       blogPost.blogStatus = blogStatus;
//       await blogPost.save();

//       res.status(200).json({ message: "Blog status updated successfully", blog: blogPost });
//   } catch (error) {
//       res.status(500).json({ message: "Error updating blog status", error: error.message });
//   }
// };

// const sendBlogStatusUpdateEmail = async (userEmail, userName, blogTitle, blogStatus, adminComments) => {
//   try {
//     const emailSettings = await EmailSetting.findOne();
//     if (!emailSettings) {
//       console.log("No email settings found in database");
//       return;
//     }

//     const transporter = nodemailer.createTransport({
//       host: emailSettings.mailHost,
//       port: emailSettings.mailPort,
//       secure: emailSettings.mailEncryption === "SSL",
//       auth: {
//         user: emailSettings.mailUsername,
//         pass: emailSettings.mailPassword,
//       },
//     });

//     await transporter.verify();
//     console.log("SMTP server is ready to send messages");

//     // Prepare image attachment
//     const imagePath = path.join(__dirname, "../controllers/Email/Artsays.png");
//     let attachments = [];

//     try {
//       if (fs.existsSync(imagePath)) {
//         attachments.push({
//           filename: "artsays-logo.png",
//           path: imagePath,
//           cid: "artsays_logo",
//         });
//       } else {
//         console.warn("Logo image not found at:", imagePath);
//       }
//     } catch (err) {
//       console.error("Error checking image:", err);
//     }

//     const mailOptions = {
//       from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
//       to: userEmail,
//       subject: `Your Blog "${blogTitle}" Status Has Been Updated to ${blogStatus}`,
//       html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <style type="text/css">
//     /* Base Styles */
//     body, html {
//       margin: 0;
//       padding: 0;
//       font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
//       line-height: 1.6;
//       color: #333333;
//       background-color: #f7f9fc;
//     }
    
//     /* Email Container */
//     .email-container {
//       max-width: 600px;
//       margin: 0 auto;
//       background: #ffffff;
//       border-radius: 8px;
//       overflow: hidden;
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//     }
    
//     /* Header Section */
//     .header {
//       background: linear-gradient(135deg, rgb(187, 125, 89) 0%, rgb(187, 125, 89) 100%);
//       padding: 30px 20px;
//       text-align: center;
//       color: white;
//     }
    
//     .logo-container {
//       margin-bottom: 20px;
//     }
    
//     .logo {
//       width: 250px;
//       height: auto;
//     }
    
//     .welcome-heading {
//       font-size: 24px;
//       font-weight: 600;
//       margin: 0;
//       color: black;
//     }
    
//     /* Content Section */
//     .content {
//       padding: 30px;
//     }
    
//     .greeting {
//       font-size: 18px;
//       margin-bottom: 25px;
//       color: #2d3748;
//     }
    
//     .message {
//       margin-bottom: 25px;
//       font-size: 16px;
//       color: #4a5568;
//     }
    
//     /* Blog Info Box */
//     .blog-info-box {
//       background: rgb(244, 236, 233);
//       border-left: 4px solid rgb(173, 100, 73);
//       padding: 20px;
//       margin: 25px 0;
//       border-radius: 4px;
//     }
    
//     .blog-info-item {
//       margin-bottom: 12px;
//       display: flex;
//     }
    
//     .blog-info-label {
//       font-weight: 600;
//       min-width: 120px;
//       color: #2d3748;
//     }
    
//     .blog-info-value {
//       color: #4a5568;
//     }
    
//     .status-badge {
//       display: inline-block;
//       padding: 4px 8px;
//       border-radius: 4px;
//       font-weight: 600;
//       font-size: 14px;
//       ${
//         blogStatus === 'Approved' 
//           ? 'background-color: #48bb78; color: white;' 
//           : blogStatus === 'Pending' 
//             ? 'background-color: #ed8936; color: white;' 
//             : 'background-color: #f56565; color: white;'
//       }
//     }
    
//     /* Admin Comments */
//     .comments-box {
//       background: #f8f9fa;
//       border-left: 4px solid #6c757d;
//       padding: 15px;
//       margin: 20px 0;
//       border-radius: 4px;
//     }
    
//     .comments-title {
//       font-weight: 600;
//       margin-bottom: 10px;
//       color: #495057;
//     }
    
//     /* Action Button */
//     .action-button {
//       display: inline-block;
//       background: rgb(173, 100, 73);
//       color: white !important;
//       text-decoration: none;
//       padding: 12px 30px;
//       border-radius: 4px;
//       font-weight: 600;
//       margin: 20px 0;
//       text-align: center;
//     }
    
//     /* Footer */
//     .footer {
//       text-align: center;
//       padding: 20px;
//       background: rgb(244, 236, 233);
//       font-size: 14px;
//       color: #718096;
//     }
    
//     .signature {
//       margin-top: 25px;
//       padding-top: 25px;
//       border-top: 1px solid #e2e8f0;
//     }
    
//     .support-text {
//       margin-top: 20px;
//       font-size: 15px;
//     }
    
//     /* Responsive */
//     @media only screen and (max-width: 600px) {
//       .email-container {
//         border-radius: 0;
//       }
//       .logo {
//         width: 200px;
//       }
//       .content {
//         padding: 20px;
//       }
//       .blog-info-item {
//         flex-direction: column;
//       }
//       .blog-info-label {
//         margin-bottom: 5px;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="email-container">
//     <!-- Header with Logo -->
//     <div class="header">
//       <div class="logo-container">
//         ${
//           attachments.length > 0
//             ? `<img src="cid:artsays_logo" alt="Artsays Logo" class="logo">`
//             : ""
//         }
//       </div>
//       <h1 class="welcome-heading">Blog Status Updated</h1>
//     </div>
    
//     <!-- Main Content -->
//     <div class="content">
//       <p class="greeting">Dear ${userName},</p>
      
//       <p class="message">The status of your blog post on Artsays has been updated by our admin team.</p>
      
//       <p class="message">Here are the updated details:</p>
      
//       <!-- Blog Info Box -->
//       <div class="blog-info-box">
//         <div class="blog-info-item">
//           <span class="blog-info-label">Blog Title:</span>
//           <span class="blog-info-value">${blogTitle}</span>
//         </div>
//         <div class="blog-info-item">
//           <span class="blog-info-label">New Status:</span>
//           <span class="blog-info-value"><span class="status-badge">${blogStatus}</span></span>
//         </div>
//         <div class="blog-info-item">
//           <span class="blog-info-label">Updated On:</span>
//           <span class="blog-info-value">${new Date().toLocaleDateString('en-US', { 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })}</span>
//         </div>
//       </div>
      
//       ${adminComments ? `
//       <!-- Admin Comments -->
//       <div class="comments-box">
//         <div class="comments-title">Admin Comments:</div>
//         <p>${adminComments}</p>
//       </div>
//       ` : ''}
      
//       <p class="message">
//         ${
//           blogStatus === 'Approved' 
//             ? 'Congratulations! Your blog has been approved and is now live on our platform.'
//             : blogStatus === 'Pending'
//               ? 'Your blog is under review by our team. We appreciate your patience.'
//               : 'Your blog submission requires some changes. Please review the admin comments above.'
//         }
//       </p>
      
//       <!-- Action Button -->
//       <div style="text-align: center;">
//         <a href="http://localhost:3000/login" class="action-button">View Your Blog</a>
//       </div>
      
//       <!-- Support Section -->
//       <div class="support-text">
//         <p>If you have any questions about this status update, please contact our support team.</p>
//       </div>
      
//       <!-- Signature -->
//       <div class="signature">
//         <p>Best regards,</p>
//         <p><strong>The Artsays Team</strong></p>
//       </div>
//     </div>
    
//     <!-- Footer -->
//     <div class="footer">
//       <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
//     </div>
//   </div>
// </body>
// </html>
//       `,
//       attachments: attachments,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Blog status update email sent to ${userEmail}`);
//   } catch (emailError) {
//     console.error("Failed to send blog status update email:", {
//       error: emailError.message,
//       stack: emailError.stack,
//     });
//   }
// };

const sendBlogStatusUpdateEmail = async (userEmail, userName, blogTitle, blogStatus, adminComments) => {
  try {
    const emailSettings = await EmailSetting.findOne();
    if (!emailSettings) {
      console.log("No email settings found in database");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.mailHost,
      port: emailSettings.mailPort,
      secure: emailSettings.mailEncryption === "SSL",
      auth: {
        user: emailSettings.mailUsername,
        pass: emailSettings.mailPassword,
      },
    });

    await transporter.verify();
    console.log("SMTP server is ready to send messages");

    // Prepare image attachment
    const imagePath = path.join(__dirname, "../controllers/Email/Artsays.png");
    let attachments = [];

    try {
      if (fs.existsSync(imagePath)) {
        attachments.push({
          filename: "artsays-logo.png",
          path: imagePath,
          cid: "artsays_logo",
        });
      } else {
        console.warn("Logo image not found at:", imagePath);
      }
    } catch (err) {
      console.error("Error checking image:", err);
    }

    // Determine status-specific content
    let statusMessage = '';
    let buttonText = 'View Your Blog';
    let buttonLink = 'http://localhost:3000/login';
    
    if (blogStatus === 'Approved') {
      statusMessage = 'Congratulations! Your blog has been approved and is now live on our platform.';
      buttonText = 'View Your Published Blog';
    } else if (blogStatus === 'Pending') {
      statusMessage = 'Your blog is under review by our team. We appreciate your patience.';
      buttonText = 'View Your Blog Draft';
    } else if (blogStatus === 'Rejected') {
      statusMessage = 'Your blog submission requires some changes. Please review your blog.';
      buttonText = 'Edit and Resubmit Your Blog';
      buttonLink = 'http://localhost:3000/login'; // Update with your edit blog URL
    }

    const mailOptions = {
      from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
      to: userEmail,
      subject: `Your Blog "${blogTitle}" Status Has Been Updated to ${blogStatus}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    /* Base Styles */
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f7f9fc;
    }
    
    /* Email Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    /* Header Section */
    .header {
      background: linear-gradient(135deg, rgb(187, 125, 89) 0%, rgb(187, 125, 89) 100%);
      padding: 30px 20px;
      text-align: center;
      color: white;
    }
    
    .logo-container {
      margin-bottom: 20px;
    }
    
    .logo {
      width: 250px;
      height: auto;
    }
    
    .welcome-heading {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      color: black;
    }
    
    /* Content Section */
    .content {
      padding: 30px;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 25px;
      color: #2d3748;
    }
    
    .message {
      margin-bottom: 25px;
      font-size: 16px;
      color: #4a5568;
    }
    
    /* Blog Info Box */
    .blog-info-box {
      background: rgb(244, 236, 233);
      border-left: 4px solid rgb(173, 100, 73);
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    
    .blog-info-item {
      margin-bottom: 12px;
      display: flex;
    }
    
    .blog-info-label {
      font-weight: 600;
      min-width: 120px;
      color: #2d3748;
    }
    
    .blog-info-value {
      color: #4a5568;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      ${
        blogStatus === 'Approved' 
          ? 'background-color: #48bb78; color: white;' 
          : blogStatus === 'Pending' 
            ? 'background-color: #ed8936; color: white;' 
            : 'background-color: #f56565; color: white;'
      }
    }
    
    /* Admin Comments */
    .comments-box {
      background: #f8f9fa;
      border-left: 4px solid #6c757d;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .comments-title {
      font-weight: 600;
      margin-bottom: 10px;
      color: #495057;
    }
    
    /* Action Button */
    .action-button {
      display: inline-block;
      background: rgb(173, 100, 73);
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 20px;
      background: rgb(244, 236, 233);
      font-size: 14px;
      color: #718096;
    }
    
    .signature {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #e2e8f0;
    }
    
    .support-text {
      margin-top: 20px;
      font-size: 15px;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .logo {
        width: 200px;
      }
      .content {
        padding: 20px;
      }
      .blog-info-item {
        flex-direction: column;
      }
      .blog-info-label {
        margin-bottom: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header with Logo -->
    <div class="header">
      <div class="logo-container">
        ${
          attachments.length > 0
            ? `<img src="cid:artsays_logo" alt="Artsays Logo" class="logo">`
            : ""
        }
      </div>
      <h1 class="welcome-heading">Blog Status Updated</h1>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <p class="greeting">Dear ${userName},</p>
      
      <p class="message">The status of your blog post on Artsays has been updated by our admin team.</p>
      
      <p class="message">Here are the updated details:</p>
      
      <!-- Blog Info Box -->
      <div class="blog-info-box">
        <div class="blog-info-item">
          <span class="blog-info-label">Blog Title:</span>
          <span class="blog-info-value">${blogTitle}</span>
        </div>
        <div class="blog-info-item">
          <span class="blog-info-label">New Status:</span>
          <span class="blog-info-value"><span class="status-badge">${blogStatus}</span></span>
        </div>
        <div class="blog-info-item">
          <span class="blog-info-label">Updated On:</span>
          <span class="blog-info-value">${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>
      
      <p class="message">${statusMessage}</p>
      
      <!-- Action Button -->
      <div style="text-align: center;">
        <a href="${buttonLink}" class="action-button">${buttonText}</a>
      </div>
      
      <!-- Support Section -->
      <div class="support-text">
        <p>If you have any questions about this status update, please contact our support team.</p>
      </div>
      
      <!-- Signature -->
      <div class="signature">
        <p>Best regards,</p>
        <p><strong>The Artsays Team</strong></p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Blog status update email sent to ${userEmail}`);
  } catch (emailError) {
    console.error("Failed to send blog status update email:", {
      error: emailError.message,
      stack: emailError.stack,
    });
  }
};

const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }

    const { blogStatus, adminComments } = req.body;
    const validStatuses = ['Approved', 'Rejected', 'Pending'];
    if (!validStatuses.includes(blogStatus)) {
      return res.status(400).json({ message: "Invalid blog status" });
    }

    const blogPost = await BlogPost.findById(id).populate('uploadedBy.id');

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Save the previous status for comparison
    const previousStatus = blogPost.blogStatus;
    blogPost.blogStatus = blogStatus;
    await blogPost.save();

    // Send email notification if status changed and user has email
    if (previousStatus !== blogStatus && blogPost.uploadedBy.id.email) {
      await sendBlogStatusUpdateEmail(
        blogPost.uploadedBy.id.email,
        blogPost.uploadedBy.name || blogPost.uploadedBy.id.username,
        blogPost.blogName,
        blogPost.blogStatus,
        adminComments
      );
    }

    res.status(200).json({ 
      success: true,
      message: "Blog status updated successfully", 
      blog: blogPost 
    });
  } catch (error) {
    console.error("Error updating blog status:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating blog status", 
      error: error.message 
    });
  }
};

const fetchBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Blog ID format" });
    }

    
    const blog = await BlogPost.findById(id).populate('uploadedBy.id', 'name email lastName profilePhoto bio');

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
