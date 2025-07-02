const BuyerRequest = require("../../../Models/Buyercustomrequest");
const User = require("../../../Models/usermode");
const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const path = require("path");
const fs = require("fs");

const updateBuyerStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { BuyerStatus, RequestStatus } = req.body;










        if (!BuyerStatus || !RequestStatus) {
            return res.status(400).json({
                message: "BuyerStatus and RequestStatus are required.",
            });
        }

        const existingRequest = await BuyerRequest.findById(requestId)
            .populate('Buyer.id', 'name email')
            .populate('Artist.id', 'name email');

        if (!existingRequest) {
            return res.status(404).json({
                message: "No buyer request found with the provided ID.",
            });
        }

        // Update both BuyerStatus and RequestStatus
        const updatedRequest = await BuyerRequest.findByIdAndUpdate(
            requestId,
            { $set: { BuyerStatus, RequestStatus } },
            { new: true }
        )
            .populate('Buyer.id', 'name email')
            .populate('Artist.id', 'name email');

        // Send email notifications
        try {
            const emailSettings = await EmailSetting.findOne();
            if (emailSettings) {
                const transporter = nodemailer.createTransport({
                    host: emailSettings.mailHost,
                    port: emailSettings.mailPort,
                    secure: emailSettings.mailEncryption === "SSL",
                    auth: {
                        user: emailSettings.mailUsername,
                        pass: emailSettings.mailPassword,
                    },
                });

                const imagePath = path.join(__dirname, "../../../controllers/Email/Artsays.png");
                let attachments = [];
                if (fs.existsSync(imagePath)) {
                    attachments.push({
                        filename: "artsays-logo.png",
                        path: imagePath,
                        cid: "artsays_logo",
                    });
                }

                // Email to Buyer
                if (updatedRequest.Buyer.id.email) {
                    const buyerMailOptions = {
                        from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
                        to: updatedRequest.Buyer.id.email,
                        subject: `Status Update for Your Custom Art Request: ${updatedRequest.ProductName}`,
                        html: generateStatusUpdateEmail(updatedRequest, 'buyer', attachments),
                        attachments,
                    };
                    await transporter.sendMail(buyerMailOptions);
                }

                // Email to Artist
                if (updatedRequest.Artist.id.email) {
                    const artistMailOptions = {
                        from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
                        to: updatedRequest.Artist.id.email,
                        subject: `Status Update for Art Request: ${updatedRequest.ProductName}`,
                        html: generateStatusUpdateEmail(updatedRequest, 'artist', attachments),
                        attachments,
                    };
                    await transporter.sendMail(artistMailOptions);
                }

                // Email to Super Admin
                const superAdmins = await User.find({ role: 'super-admin' });
                if (superAdmins.length > 0) {
                    const adminMailOptions = {
                        from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
                        to: superAdmins.map(admin => admin.email).join(','),
                        subject: `Status Update for Art Request: ${updatedRequest.ProductName}`,
                        html: generateStatusUpdateEmail(updatedRequest, 'admin', attachments),
                        attachments,
                    };
                    await transporter.sendMail(adminMailOptions);
                }
            }
        } catch (emailError) {
            console.error("Failed to send status update emails:", emailError);
        }

        res.status(200).json({
            message: "Buyer status and request status updated successfully",
            updatedRequest,
        });
    } catch (error) {
        console.error("Error updating buyer status:", error);
        res.status(500).json({
            message: "Error updating the buyer status and request status",
            error: error.message,
        });
    }
};

// Helper function to generate status update email HTML
function generateStatusUpdateEmail(request, recipientType, attachments) {
    const buyerName = request.Buyer.id.name || 'Customer';
    const artistName = request.Artist.id.name || 'the Artist';
    const isBuyerEmail = recipientType === 'buyer';
    const isArtistEmail = recipientType === 'artist';
    const isAdminEmail = recipientType === 'admin';

    return `
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
        <div class="email-container" style="max-width:600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                <div style="margin-bottom: 20px;">
                    ${attachments.length > 0
                        ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">`
                        : ""}
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">
                    ${isBuyerEmail ? 'Request Status Update' : 
                      isArtistEmail ? 'Request Status Update' : 'Request Status Changed'}
                </h1>
            </div>
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${isBuyerEmail ? buyerName : isArtistEmail ? artistName : 'Admin'},
                </p>
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    ${isBuyerEmail 
                        ? `The status of your custom art request "${request.ProductName}" has been updated to ${request.BuyerStatus} (Request Status: ${request.RequestStatus}).`
                        : isArtistEmail
                            ? `The status of the art request "${request.ProductName}" from ${buyerName} has been updated to ${request.BuyerStatus} (Request Status: ${request.RequestStatus}).`
                            : `The status of the art request "${request.ProductName}" from ${buyerName} has been updated to ${request.BuyerStatus} (Request Status: ${request.RequestStatus}) by ${artistName}.`}
                </p>
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Product:</span>
                        <span>${request.ProductName}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request ID:</span>
                        <span>${request._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Buyer Status:</span>
                        <span>${request.BuyerStatus}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request Status:</span>
                        <span>${request.RequestStatus}</span>
                    </div>
                </div>
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" style="display: inline-block; background: #AD6449; color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; margin: 20px 0; text-align: center;">
                        ${isBuyerEmail ? 'View Request Details' : 
                          isArtistEmail ? 'View Request Details' : 'Monitor Request'}
                    </a>
                </div>
                <div style="margin-top: 20px; font-size: 15px;">
                    <p>If you have any questions, please contact our support team.</p>
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
    `;
}

module.exports = updateBuyerStatus;