const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const User = require("../../../Models/usermode");
const path = require("path");
const fs = require("fs");

// Store OTPs in memory (in production, use Redis or a database)
const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  try {
    const emailSettings = await EmailSetting.findOne();
    if (!emailSettings) {
      throw new Error("No email settings found");
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

    const imagePath = path.join(__dirname, "../../../controllers/Email/Artsays.png");
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
      to: email,
      subject: "Artsays - Email Verification OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @media only screen and (max-width: 600px) {
                    .outer-container {
                        padding: 0px 0 !important;
                    }
                    .email-container {
                        border-radius: 0 !important;
                    }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #F8F1EE;">
            <div class="outer-container" style="padding: 80px 0; background-color: #F8F1EE; width: 100%;">
                <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                        <div style="margin-bottom: 20px;">
                            ${attachments.length > 0 ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ""}
                        </div>
                        <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">Email Verification</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">Dear User,</p>
                        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">Please use the following OTP to verify your email address:</p>
                        <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px; text-align: center;">
                            <h2 style="font-size: 24px; color: #AD6449; margin: 0;">${otp}</h2>
                        </div>
                        <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">This OTP is valid for 10 minutes.</p>
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
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOTP();
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); 

    await sendOTPEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

module.exports = { sendOTP, otpStore };