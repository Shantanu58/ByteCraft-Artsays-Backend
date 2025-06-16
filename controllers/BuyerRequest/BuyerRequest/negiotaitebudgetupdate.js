const BuyerRequest = require("../../../Models/Buyercustomrequest");
const User = require("../../../Models/usermode");
const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const path = require("path");
const fs = require("fs");

const updateBuyerRequestByBuyerId = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { ProductName, Description, MaxBudget, MinBudget, NegotiatedBudget, Notes } = req.body;

        if (!ProductName || !Description || !MaxBudget || !MinBudget || !NegotiatedBudget || !Notes) {
            return res.status(400).json({
                message: "ProductName, Description, MaxBudget, MinBudget, NegotiatedBudget, and Notes are required.",
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

        if (existingRequest.updateCount >= 3) {
            return res.status(400).json({
                message: "This buyer request has already been updated two times and cannot be updated again.",
            });
        }

        const newUpdateCount = existingRequest.updateCount + 1;
        const remainingAttempts = 3 - newUpdateCount;
        let updateFields = {
            ProductName,
            Description,
            MaxBudget,
            MinBudget,
            NegotiatedBudget,
            Notes,
            updateCount: newUpdateCount,
            RequestStatus: 'Approved'
        };

        const updatedRequest = await BuyerRequest.findByIdAndUpdate(
            requestId,
            { $set: updateFields },
            { new: true }
        ).populate('Buyer.id', 'name email')
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

                // Prepare image attachment
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
                        subject: `Negotiation Update for Your Custom Art Request: ${updatedRequest.ProductName}`,
                        html: generateNegotiationEmail(updatedRequest, 'buyer', attachments, remainingAttempts),
                        attachments: attachments // Add attachments here
                    };
                    await transporter.sendMail(buyerMailOptions);
                }

                // Email to Artist
                if (updatedRequest.Artist.id.email) {
                    const artistMailOptions = {
                        from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
                        to: updatedRequest.Artist.id.email,
                        subject: `Negotiation Submitted for Art Request: ${updatedRequest.ProductName}`,
                        html: generateNegotiationEmail(updatedRequest, 'artist', attachments, remainingAttempts),
                        attachments: attachments // Add attachments here
                    };
                    await transporter.sendMail(artistMailOptions);
                }

                // Email to Super Admin
                const superAdmins = await User.find({ role: 'super-admin' });
                if (superAdmins.length > 0) {
                    const adminMailOptions = {
                        from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
                        to: superAdmins.map(admin => admin.email).join(','),
                        subject: `Negotiation Started for Art Request: ${updatedRequest.ProductName}`,
                        html: generateNegotiationEmail(updatedRequest, 'admin', attachments, remainingAttempts),
                        attachments: attachments // Add attachments here
                    };
                    await transporter.sendMail(adminMailOptions);
                }
            }
        } catch (emailError) {
            console.error("Failed to send negotiation emails:", emailError);
        }

        res.status(200).json({
            message: "Buyer request updated successfully",
            updatedRequest,
            remainingAttempts
        });

    } catch (error) {
        console.error("Error updating buyer request:", error);
        res.status(500).json({
            message: "Error updating the buyer request",
            error: error.message,
        });
    }
};

// Helper function to generate negotiation email HTML
function generateNegotiationEmail(request, recipientType, attachments, remainingAttempts) {
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
        <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                <div style="margin-bottom: 20px;">
                    ${attachments.length > 0
                        ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">`
                        : ""}
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">
                    ${isBuyerEmail ? 'Negotiation Update' : 
                      isArtistEmail ? 'Negotiation Submitted' : 'New Negotiation Started'}
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${isBuyerEmail ? buyerName : isArtistEmail ? artistName : 'Admin'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    ${isBuyerEmail 
                        ? `${artistName} has sent a negotiation proposal for your custom art request "${request.ProductName}".` 
                        : isArtistEmail
                            ? `You have submitted a negotiation proposal for "${request.ProductName}" requested by ${buyerName}.`
                            : `Artist ${artistName} has started negotiation for the request "${request.ProductName}" from ${buyerName}.`}
                </p>
                
                ${isArtistEmail && remainingAttempts === 1 ? `
                <div style="background-color: #FFF3E0; border-left: 4px solid #FFA000; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #E65100; font-weight: bold;">Important Notice</p>
                    <p style="margin: 10px 0 0 0; color: #E65100;">
                        This is your <strong>last negotiation attempt</strong> for this request. 
                        You won't be able to negotiate further after this.
                    </p>
                </div>
                ` : ''}
                
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
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Negotiated Budget:</span>
                        <span>₹${request.NegotiatedBudget}</span>
                    </div>
                    ${isBuyerEmail || isAdminEmail ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Original Budget:</span>
                        <span>₹${request.MinBudget} - ₹${request.MaxBudget}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Artist Notes:</span>
                        <span>${request.Notes}</span>
                    </div>
                </div>
                
                <div style="background-color: #FFF3E0; border-left: 4px solid #FFA000; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #E65100; font-weight: bold;">
                        ${isBuyerEmail ? 'Next Steps' : 
                          isArtistEmail ? 'Important' : 'Action Required'}
                    </p>
                    <p style="margin: 10px 0 0 0; color: #E65100;">
                        ${isBuyerEmail
                            ? 'Please review the negotiation proposal and respond by accepting or making a counter-offer.'
                            : isArtistEmail
                                ? remainingAttempts === 1 
                                    ? 'This is your final negotiation attempt. Please ensure your terms are final.'
                                    : `You have ${remainingAttempts} more negotiation attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
                                : 'Please monitor this negotiation and ensure both parties reach a fair agreement.'}
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" style="display: inline-block; background: #AD6449; color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; margin: 20px 0; text-align: center;">
                        ${isBuyerEmail ? 'Respond to Negotiation' : 
                          isArtistEmail ? 'View Request Details' : 'Monitor Negotiation'}
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

module.exports = updateBuyerRequestByBuyerId;