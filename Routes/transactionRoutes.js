// const express = require('express');
// const router = express.Router();
// const Transaction = require('../Models/transactionModel'); // Adjust the path if necessary
// const User = require('../Models/usermode'); // Ensure you import User model for validation

// const mongoose = require('mongoose');

// // POST request to create a new transaction
// router.post('/create-transaction', async (req, res) => {
//     const { user_id, order_id, art_id, amount, mode_of_payment, status } = req.body;

//     try {
//         // Check if the user exists
//         const user = await User.findById(user_id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Validate ObjectId
//         if (!mongoose.isValidObjectId(order_id) || !mongoose.isValidObjectId(art_id)) {
//             return res.status(400).json({ message: "Invalid order_id or art_id" });
//         }

//         // Convert order_id and art_id to ObjectId
//         const orderId = new mongoose.Types.ObjectId(order_id);
//         const artId = new mongoose.Types.ObjectId(art_id);

//         // Create a new transaction
//         const newTransaction = new Transaction({
//             user_id,
//             order_id: orderId,
//             art_id: artId,
//             amount,
//             mode_of_payment,
//             status
//         });

//         await newTransaction.save();

//         // Push the transaction ID into the user's transactions array
//         user.transactions.push(newTransaction._id);
//         await user.save();

//         res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error creating transaction", error: error.message });
//     }
// });


// module.exports = router;

const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transactionModel');
const User = require('../Models/usermode');
const EmailSetting = require('../Models/EmailSetting');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

router.post('/create-transaction', async (req, res) => {
    const { user_id, order_id, art_id, amount, mode_of_payment, status } = req.body;

    try {
        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!mongoose.isValidObjectId(order_id) || !mongoose.isValidObjectId(art_id)) {
            return res.status(400).json({ message: "Invalid order_id or art_id" });
        }

        const orderId = new mongoose.Types.ObjectId(order_id);
        const artId = new mongoose.Types.ObjectId(art_id);

        const newTransaction = new Transaction({
            user_id,
            order_id: orderId,
            art_id: artId,
            amount,
            mode_of_payment,
            status
        });

        await newTransaction.save();
        user.transactions.push(newTransaction._id);
        await user.save();

        // Send transaction confirmation email
        try {
            const emailSettings = await EmailSetting.findOne();
            const transporter = nodemailer.createTransport({
                host: emailSettings.mailHost,
                port: emailSettings.mailPort,
                secure: emailSettings.mailEncryption === "SSL",
                auth: {
                    user: emailSettings.mailUsername,
                    pass: emailSettings.mailPassword,
                },
            });

            const imagePath = path.join(__dirname, "../controllers/Email/Artsays.png");
            let attachments = [];
            if (fs.existsSync(imagePath)) {
                attachments.push({
                    filename: "artsays-logo.png",
                    path: imagePath,
                    cid: "artsays_logo",
                });
            }

            const mailOptions = {
                from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
                to: user.email,
                subject: `Payment of ₹${amount} received for Order #${order_id.toString().slice(-6)} | Artsays`,
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
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F8F1EE;">
    <div class="outer-container" style="padding: 80px 0; background-color: #F8F1EE; width: 100%;">
        <div class="email-container" style="max-width: 600px; margin: auto; background: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                ${attachments.length > 0 ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ''}
                <h1 style="font-size: 24px; font-weight: 600; margin: 20px 0;">Transaction Successful</h1>
            </div>
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 20px;">Dear ${user.name || 'User'},</p>
                <p style="font-size: 16px; color: #4a5568;">Thank you for your payment. Your transaction has been successfully processed.</p>

                <div style="background: #F4ECE9; padding: 20px; border-left: 4px solid #AD6449; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px;">
                        <strong>Transaction ID:</strong> ${newTransaction._id}
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Order ID:</strong> ${order_id}
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Amount:</strong> ₹${amount}
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Payment Mode:</strong> ${mode_of_payment}
                    </div>
                    <div style="margin-bottom: 12px;">
                        <strong>Status:</strong> ${status}
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="http://localhost:3000/user/orders" style="display: inline-block; background: #AD6449; color: white; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600;">View Your Orders</a>
                </div>

                <p style="margin-top: 25px;">If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br><strong>The Artsays Team</strong></p>
            </div>
            <div style="text-align: center; padding: 20px; background: #F4ECE9; font-size: 14px; color: #7A5C50;">
                <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
                `,
                attachments
            };

            await transporter.sendMail(mailOptions);
            console.log(`Transaction email sent to: ${user.email}`);
        } catch (emailErr) {
            console.error("Transaction email error:", emailErr);
        }

        res.status(201).json({
            message: "Transaction created and email sent successfully",
            transaction: newTransaction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating transaction", error: error.message });
    }
});

module.exports = router;

