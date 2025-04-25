// Routes/requestedArtsRoutes.js
// const express = require('express');
// const router = express.Router();
// const RequestedArts = require('../Models/RequestedArts'); // The requested arts model
// const User = require('../Models/usermode'); // Assuming you have a User model
const express = require('express');
const router = express.Router();
const RequestedArts = require('../Models/RequestedArts');
const User = require('../Models/usermode');
const nodemailer = require('nodemailer');
const EmailSetting = require('../Models/EmailSetting');
const path = require('path');
const fs = require('fs');

const sendArtRequestEmails = async (request, buyer, artist, superAdmins) => {
  try {
    const emailSettings = await EmailSetting.findOne();
    if (!emailSettings) return;

    const transporter = nodemailer.createTransport({
      host: emailSettings.mailHost,
      port: emailSettings.mailPort,
      secure: emailSettings.mailEncryption === "SSL",
      auth: {
        user: emailSettings.mailUsername,
        pass: emailSettings.mailPassword,
      },
    });

    // Prepare image attachment
    const imagePath = path.join(__dirname, "../../controllers/Email/Artsays.png");
    let attachments = [];
    if (fs.existsSync(imagePath)) {
      attachments.push({
        filename: "artsays-logo.png",
        path: imagePath,
        cid: "artsays_logo",
      });
    }

// Route to request a custom painting
const emailTemplates = {
  buyer: {
    subject: `Your Custom Art Request #${request._id} Has Been Submitted`,
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
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #F8F1EE;">
    <div class="outer-container" style="padding: 80px 0; background-color: #F8F1EE; width: 100%;">
        <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                <div style="margin-bottom: 20px;">
                    ${attachments.length > 0 ? 
                        `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ''}
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">
                    Custom Art Request Submitted
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${buyer.name || 'Valued Customer'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    Thank you for submitting your custom art request on Artsays. We've notified the artist and they'll respond soon.
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request ID:</span>
                        <span>${savedRequest._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Artist:</span>
                        <span>${artist.name}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Your Asking Price:</span>
                        <span>$${askingPrice.toFixed(2)}</span>
                    </div>
                    ${discountedPrice ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Discounted Price:</span>
                        <span>$${discountedPrice.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Final Price:</span>
                        <span>$${finalPrice.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request Date:</span>
                        <span>${new Date(savedRequest.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #2E7D32; font-weight: bold;">Next Steps</p>
                    <p style="margin: 10px 0 0 0; color: #2E7D32;">
                        The artist will review your request and may contact you for additional details. You'll be notified when they respond.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Your Request
                    </a>
                </div>
                
                <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #E2D5D0;">
                    <p>Best regards,</p>
                    <p><strong>The Artsays Team</strong></p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #F4ECE9; font-size: 14px; color: #7A5C50;">
                <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `
  },
  artist: {
    subject: `New Custom Art Request #${request._id} Received`,
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
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #F8F1EE;">
    <div class="outer-container" style="padding: 80px 0; background-color: #F8F1EE; width: 100%;">
        <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                <div style="margin-bottom: 20px;">
                    ${attachments.length > 0 ? 
                        `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ''}
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">
                    New Custom Art Request
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${artist.name || 'Artist'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    You've received a new custom art request on Artsays. Here are the details:
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request ID:</span>
                        <span>${savedRequest._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">From:</span>
                        <span>${buyer.name} (${buyer.email})</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Description:</span>
                        <span>${description}</span>
                    </div>
                    ${attributes ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Attributes:</span>
                        <span>${attributes}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Asking Price:</span>
                        <span>$${askingPrice.toFixed(2)}</span>
                    </div>
                    ${discountedPrice ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Your Discounted Price:</span>
                        <span>$${discountedPrice.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Final Price:</span>
                        <span>$${finalPrice.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request Date:</span>
                        <span>${new Date(savedRequest.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <div style="background-color: #E3F2FD; border-left: 4px solid #1976D2; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #0D47A1; font-weight: bold;">Next Steps</p>
                    <p style="margin: 10px 0 0 0; color: #0D47A1;">
                        Please review this request and respond to the buyer through the Artsays platform. You can accept, negotiate, or decline the request.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View & Respond to Request
                    </a>
                </div>
                
                <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #E2D5D0;">
                    <p>Best regards,</p>
                    <p><strong>The Artsays Team</strong></p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #F4ECE9; font-size: 14px; color: #7A5C50;">
                <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `
  },
  admin: {
    subject: `New Custom Art Request #${request._id} Submitted`,
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
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #F8F1EE;">
    <div class="outer-container" style="padding: 80px 0; background-color: #F8F1EE; width: 100%;">
        <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                <div style="margin-bottom: 20px;">
                    ${attachments.length > 0 ? 
                        `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ''}
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">
                    New Custom Art Request
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear Admin Team,
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    A new custom art request has been submitted on Artsays. Here are the details:
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request ID:</span>
                        <span>${savedRequest._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Buyer:</span>
                        <span>${buyer.name} (${buyer.email})</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Artist:</span>
                        <span>${artist.name} (${artist.email})</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Description:</span>
                        <span>${description}</span>
                    </div>
                    ${attributes ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Attributes:</span>
                        <span>${attributes}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Asking Price:</span>
                        <span>$${askingPrice.toFixed(2)}</span>
                    </div>
                    ${discountedPrice ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Discounted Price:</span>
                        <span>$${discountedPrice.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Final Price:</span>
                        <span>$${finalPrice.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request Date:</span>
                        <span>${new Date(savedRequest.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <div style="background-color: #FFF3E0; border-left: 4px solid #FB8C00; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #E65100; font-weight: bold;">Admin Notice</p>
                    <p style="margin: 10px 0 0 0; color: #E65100;">
                        This is an informational email. No action is required unless you notice any issues with this request.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Request Details
                    </a>
                </div>
                
                <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #E2D5D0;">
                    <p>Best regards,</p>
                    <p><strong>The Artsays Team</strong></p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #F4ECE9; font-size: 14px; color: #7A5C50;">
                <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `
  }
};

// Send emails
await Promise.all([
  transporter.sendMail({
    from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
    to: buyer.email,
    subject: emailTemplates.buyer.subject,
    html: emailTemplates.buyer.html,
    attachments
  }),
  transporter.sendMail({
    from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
    to: artist.email,
    subject: emailTemplates.artist.subject,
    html: emailTemplates.artist.html,
    attachments
  }),
  superAdmins.length > 0 && transporter.sendMail({
    from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
    to: superAdmins.map(admin => admin.email).join(','),
    subject: emailTemplates.admin.subject,
    html: emailTemplates.admin.html,
    attachments
  })
]);

console.log('Custom art request emails sent successfully');
} catch (emailError) {
console.error("Failed to send custom art request emails:", emailError);
}
};

// Route to request a custom painting
router.post('/request-art', async (req, res) => {
const { userId, artistId, description, attributes, askingPrice, discountedPrice, finalPrice } = req.body;

try {
// Check if the user and artist exist
const [user, artist, superAdmins] = await Promise.all([
  User.findById(userId),
  User.findById(artistId),
  User.find({ role: 'super-admin' })
]);

if (!user || !artist) {
  return res.status(404).json({ message: 'User or artist not found' });
}

// Create a new requested art entry
const requestedArt = new RequestedArts({
  userId,
  artistId,
  description,
  attributes,
  askingPrice,
  discountedPrice,
  finalPrice
});

const savedRequest = await requestedArt.save();

// Send email notifications
await sendArtRequestEmails(savedRequest, user, artist, superAdmins);

res.status(201).json({ 
  success: true, 
  message: 'Custom art request created successfully', 
  request: savedRequest 
});
} catch (error) {
res.status(500).json({ 
  success: false,
  message: 'Error creating custom art request', 
  error: error.message 
});
}
});

// Route to get all custom painting requests for a buyer
router.get('/buyer-requests/:userId', async (req, res) => {
const { userId } = req.params;

try {
const requests = await RequestedArts.find({ userId })
  .populate('artistId', 'name email profilePicture')
  .sort({ createdAt: -1 });

res.status(200).json({ 
  success: true,
  data: requests 
});
} catch (error) {
res.status(500).json({ 
  success: false,
  message: 'Error fetching requests', 
  error: error.message 
});
}
});

// Route to get all custom painting requests for an artist
router.get('/artist-requests/:artistId', async (req, res) => {
const { artistId } = req.params;

try {
const requests = await RequestedArts.find({ artistId })
  .populate('userId', 'name email profilePicture')
  .sort({ createdAt: -1 });

res.status(200).json({ 
  success: true,
  data: requests 
});
} catch (error) {
res.status(500).json({ 
  success: false,
  message: 'Error fetching requests', 
  error: error.message 
});
}
});

module.exports = router;