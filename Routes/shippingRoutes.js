const express = require('express');
const router = express.Router();
const ShippingDetails = require('../Models/shippingDetailsModel');
const User = require('../Models/usermode');
const Address = require('../Models/adressschema');
const nodemailer = require('nodemailer');
const EmailSetting = require('../Models/EmailSetting');
const path = require('path');
const fs = require('fs');

router.post('/create-shipping', async (req, res) => {
    const { user_id, transaction_id, address_id } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the address exists
        const address = await Address.findById(address_id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Create new shipping details
        const shippingDetails = new ShippingDetails({
            user_id,
            transaction_id,
            address_id,
            shop_address: "Shop Address Here",
        });

        await shippingDetails.save();

        // Populate the address details
        const populatedShippingDetails = await ShippingDetails.findById(shippingDetails._id)
            .populate('address_id');

        // Send shipping confirmation email
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
                const imagePath = path.join(__dirname, "../controllers/Email/Artsays.png");
                let attachments = [];
                if (fs.existsSync(imagePath)) {
                    attachments.push({
                        filename: "artsays-logo.png",
                        path: imagePath,
                        cid: "artsays_logo",
                    });
                }

                // Email content
                const mailOptions = {
                    from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
                    to: user.email,
                    subject: `Shipping Confirmation - Order #${transaction_id}`,
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
                    Shipping Confirmation
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${user.name || 'Valued Customer'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    Your order is being prepared for shipment. Here are the shipping details:
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Order ID:</span>
                        <span>${transaction_id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Shipping Address:</span>
                        <span>
                            ${address.street_address},<br>
                            ${address.city}, ${address.state}<br>
                            ${address.country} - ${address.pincode}
                        </span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Shop Address:</span>
                        <span>${shippingDetails.shop_address}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Shipping Date:</span>
                        <span>${new Date(shippingDetails.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #2E7D32; font-weight: bold;">Next Steps</p>
                    <p style="margin: 10px 0 0 0; color: #2E7D32;">
                        Your order will be dispatched within 2-3 business days. You'll receive another email with tracking information once it's shipped.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        Track Your Order
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
                    `,
                    attachments,
                };

                await transporter.sendMail(mailOptions);
                console.log(`Shipping confirmation email sent to ${user.email}`);
            }
        } catch (emailError) {
            console.error("Failed to send shipping confirmation email:", emailError);
        }

        res.status(201).json({
            message: "Shipping details created successfully",
            shippingDetails: populatedShippingDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating shipping details" });
    }
});



// GET request to retrieve shipping details by ID
router.get('/:id', async (req, res) => {
    try {
        // Find the shipping details by ID and populate the address and user data
        const shippingDetails = await ShippingDetails.findById(req.params.id)
            .populate({
                path: 'address_id', // Populate the address_id with full address data
                select: 'country state city street_address pincode' // Select the address fields you want to display
            })
            .populate('user_id'); // Optionally populate user details if needed

        if (!shippingDetails) {
            return res.status(404).json({ message: "Shipping details not found" });
        }

        res.json(shippingDetails); // Return the shipping details with populated address data
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching shipping details" });
    }
});



// Export the router
module.exports = router;
