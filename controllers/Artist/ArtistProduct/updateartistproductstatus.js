// const ProductStatus = require("../../../Models/CropImage");

// const updateProductStatusById = async (req, res) => {
//     try {
//         const { id } = req.params; 
//         const { status } = req.body; 

//         if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
//             return res.status(400).json({
//                 message: "Invalid status. Valid options are 'Approved', 'Rejected', or 'Pending'.",
//             });
//         }

//         const updatedProductStatus = await ProductStatus.findByIdAndUpdate(
//             id,
//             { $set: { status: status, updatedAt: Date.now() } }, 
//             { new: true } 
//         );

//         if (!updatedProductStatus) {
//             return res.status(404).json({
//                 message: "No product status found with the provided ID.",
//             });
//         }

//         res.status(200).json({
//             message: "Product status updated successfully",
//             updatedProductStatus,
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Error updating the product status",
//             error: error.message,
//         });
//     }
// };

// module.exports = updateProductStatusById;


const Product = require("../../../Models/CropImage");
const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const User = require("../../../Models/usermode");
const fs = require("fs");
const path = require("path");

const updateProductStatusById = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status, rejectionReason } = req.body; 

        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Valid options are 'Approved', 'Rejected', or 'Pending'.",
            });
        }

        const updateFields = { 
            status: status, 
            updatedAt: Date.now() 
        };

        if (status === 'Rejected' && rejectionReason) {
            updateFields.rejectionReason = rejectionReason;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateFields }, 
            { new: true } 
        ).populate('userId');

        if (!updatedProduct) {
            return res.status(404).json({
                message: "No product found with the provided ID.",
            });
        }

        // Send email notification to the product creator
        await sendStatusUpdateEmail(updatedProduct, rejectionReason);

        res.status(200).json({
            message: "Product status updated successfully",
            updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating the product status",
            error: error.message,
        });
    }
};

const sendStatusUpdateEmail = async (product, rejectionReason) => {
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

        const logoPath = path.join(__dirname, "../../../controllers/Email/Artsays.png");
        let attachments = [];

        if (fs.existsSync(logoPath)) {
            attachments.push({
                filename: "artsays-logo.png",
                path: logoPath,
                cid: "artsays_logo",
            });
        }

        const user = await User.findById(product.userId);
        if (!user) {
            console.log("User not found for product creator");
            return;
        }

        const statusBadgeStyle = 
            product.status === "Approved" 
                ? "background-color: #48bb78; color: white;" 
                : product.status === "Rejected" 
                ? "background-color: #f56565; color: white;" 
                : "background-color: #ed8936; color: white;";

        const mailOptions = {
            from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
            to: user.email,
            subject: `Your Product "${product.productName}" Status Has Been Updated`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .outer-container { padding: 0px 0 !important; }
      .email-container { border-radius: 0 !important; }
      .content { padding: 20px !important; }
      .product-info-item { flex-direction: column !important; }
      .product-info-label { margin-bottom: 5px !important; }
    }
    
    .image-container {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .notice-box {
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid;
    }
    
    .approved-notice {
      background-color: #f0fff4;
      border-color: #48bb78;
      color: #2f855a;
    }
    
    .rejected-notice {
      background-color: #fff5f5;
      border-color: #f56565;
      color: #c53030;
    }
    
    .pending-notice {
      background-color: #fffaf0;
      border-color: #ed8936;
      color: #9c4221;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f2f2f2;">
  <div class="outer-container" style="padding: 80px 0; background-color: #f2f2f2; width: 100%;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div class="header" style="background: linear-gradient(135deg, rgb(204, 151, 121) 0%, rgb(204, 151, 121) 100%); padding: 30px 20px; text-align: center; color: white;">
        <div class="logo-container" style="margin-bottom: 20px;">
          ${attachments.length > 0 ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ""}
        </div>
        <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: black;">Product Status Updated</h1>
      </div>

      <!-- Content -->
      <div class="content" style="padding: 30px;">
        <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">Dear ${user.name},</p>
        
        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">The status of your product <strong>${product.productName}</strong> has been updated.</p>
        
        <!-- Status Notice -->
        <div class="notice-box ${product.status.toLowerCase()}-notice">
          <p style="margin: 0; font-weight: bold;">Status Update:</p>
          <p style="margin: 10px 0 0 0;">
            <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 14px; ${statusBadgeStyle}">
              ${product.status}
            </span>
            ${product.status === 'Rejected' && rejectionReason ? `<br><br><strong>Reason:</strong> ${rejectionReason}` : ''}
          </p>
        </div>
        
        <!-- Product Info Box -->
        <div style="background: rgb(244, 236, 233); border-left: 4px solid rgb(173, 100, 73); padding: 20px; margin: 25px 0; border-radius: 4px;">
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Product Title:</span>
            <span style="color: #4a5568;">${product.productName}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Updated On:</span>
            <span style="color: #4a5568;">
              ${new Date(product.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div style="margin-bottom: 12px; display: flex;">
            <span style="font-weight: 600; min-width: 120px; color: #2d3748;">Price:</span>
            <span style="color: #4a5568;">₹${product.finalPrice || product.sellingPrice}</span>
          </div>
        </div>
        
        <!-- Next Steps -->
        <div style="margin: 25px 0;">
          <p style="font-weight: 600; margin-bottom: 10px; color: #2d3748;">Next Steps:</p>
          ${product.status === 'Approved' ? `
            <p style="margin: 5px 0; color: #4a5568;">• Your product is now live on our platform and visible to buyers.</p>
            <p style="margin: 5px 0; color: #4a5568;">• You can track its performance from your seller dashboard.</p>
          ` : ''}
          ${product.status === 'Rejected' ? `
            <p style="margin: 5px 0; color: #4a5568;">• Please review the reason for rejection above.</p>
            <p style="margin: 5px 0; color: #4a5568;">• You can edit and resubmit your product for approval.</p>
            ${rejectionReason ? `<p style="margin: 5px 0; color: #4a5568;">• Please address the issues mentioned before resubmitting.</p>` : ''}
          ` : ''}
          ${product.status === 'Pending' ? `
            <p style="margin: 5px 0; color: #4a5568;">• Our team is reviewing your product submission.</p>
            <p style="margin: 5px 0; color: #4a5568;">• You will be notified once the review is complete.</p>
          ` : ''}
        </div>
        
        <!-- Action Button -->
        <div style="text-align: center;">
          <a href="http://localhost:3000/login" style="display: inline-block; background: rgb(173, 100, 73); color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; margin: 20px 0; text-align: center;">
            ${product.status === 'Rejected' ? 'Edit Product' : 'View Product'}
          </a>
        </div>
        
        <!-- Support Section -->
        <div style="margin-top: 20px; font-size: 15px;">
          <p>If you have any questions about this status update, please contact our support team.</p>
        </div>
        
        <!-- Signature -->
        <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
          <p>Best regards,</p>
          <p><strong>The Artsays Team</strong></p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; background:rgb(244, 236, 233); font-size: 14px; color: #718096;">
        <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
            `,
            attachments: attachments
        };

        await transporter.sendMail(mailOptions);
        console.log(`Status update email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending status update email:", error);
    }
};

module.exports = updateProductStatusById;