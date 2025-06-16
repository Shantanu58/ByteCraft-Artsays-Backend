const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../Models/usermode");
const BusinessProfile = require("../../../models/sellerbusinessprofile");
const ArtistDetails = require("../../../models/artistdetails");
const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const EmailTemplate = require("../../../Models/NewUserTemplate");
const NewSellerTemplate = require("../../../Models/NewSellerTemplate");
const NewBuyerTemplate = require("../../../Models/NewBuyerTemplates");
const path = require("path");
const fs = require("fs");

const allowedUserTypes = ["Artist", "Buyer", "Seller", "Super-Admin"];


const notifySuperAdmin = async (newUser, userType) => {
  try {
    const emailSettings = await EmailSetting.findOne();
    if (!emailSettings) {
      console.log("No email settings found in database");
      return;
    }


    const superAdmins = await User.find({ role: "super-admin" });
    if (superAdmins.length === 0) {
      console.log("No super-admin found to notify");
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


    const imagePath = path.join(
      __dirname,
      "../../../controllers/Email/Artsays.png"
    );
    let attachments = [];

    if (fs.existsSync(imagePath)) {
      attachments.push({
        filename: "artsays-logo.png",
        path: imagePath,
        cid: "artsays_logo",
      });
    }

    const adminDashboardLink = "http://localhost:3000/login";

    const mailOptions = {
      from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
      to: superAdmins.map((admin) => admin.email).join(","),
      subject: `New ${userType} Registration - Requires Verification`,
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
    <!-- Outer Container with background color -->
    <div class="outer-container" style="padding: 80px 0; background-color: #F8F1EE; width: 100%;">
        <!-- Email Container -->
        <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <!-- Header Section -->
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                <div style="margin-bottom: 20px;">
                    ${attachments.length > 0
          ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">`
          : ""
        }
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">New ${userType} Registration</h1>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">Dear Admin,</p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">A new ${userType} has registered on Artsays and requires verification.</p>
                
                <!-- User Details Box -->
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Name: ${newUser.name
        } ${newUser.lastName}</span>
                    </div>
                    ${newUser.email
          ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Email: ${newUser.email}</span>
                    </div>`
          : ""
        }
                    ${newUser.phone
          ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Phone: ${newUser.phone}</span>
                    </div>`
          : ""
        }
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">User Type: ${userType}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Registered At: ${new Date().toLocaleString()}</span>
                    </div>
                </div>
                
                <!-- Status Notice -->
                <div style="background-color: #FFF3E0; border-left: 4px solid #FFA000; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #E65100; font-weight: bold;">Verification Required</p>
                    <p style="margin: 10px 0 0 0; color: #E65100;">
                        This new ${userType} account is currently <strong>Unverified</strong>. 
                        Please review the registration and verify the account if appropriate.
                    </p>
                </div>
                
                <!-- Action Button -->
                <div style="text-align: center;">
                    <a href="${adminDashboardLink}" style="display: inline-block; background: #AD6449; color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; margin: 20px 0; text-align: center;">Review in Admin Dashboard</a>
                </div>
                
                <!-- Signature -->
                <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #E2D5D0;">
                    <p>Best regards,</p>
                    <p><strong>The Artsays Team</strong></p>
                </div>
            </div>
            
            <!-- Footer -->
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
    console.log("Notification sent to super-admin");
  } catch (error) {
    console.error("Error sending super-admin notification:", error);
  }
};

const createuser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      userType,
      businessName,
      artistName,
    } = req.body;

    if (!firstName || !lastName || !password || !confirmPassword || !userType) {
      return res
        .status(400)
        .json({ message: "All required fields are missing" });
    }

    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Either email or phone number is required" });
    }

    if (!allowedUserTypes.includes(userType)) {
      return res.status(400).json({
        message:
          "Invalid userType. Must be 'Artist', 'Buyer', 'Seller', or 'Super-Admin'.",
      });
    }

    const roleSpecificRequirements = {
      Seller: () => !businessName && "Business name is required for sellers",
      Artist: () => !artistName && "Artist name is required for artists",
    };

    const errorMessage = roleSpecificRequirements[userType]?.();
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }

    if (phone) {
      const cleanPhone = phone.replace(/^\+91/, "");
      if (cleanPhone.length !== 10 || !/^[0-9]{10}$/.test(cleanPhone)) {
        return res
          .status(400)
          .json({ message: "Phone number must be 10 digits" });
      }
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long and contain only letters and digits"
      });
    }

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone
          ? [{ phone: `+91${String(phone).replace(/^\+91/, "")}` }]
          : []),
      ],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: "Email or phone number is already registered" });
      }
      if (existingUser.phone === `+91${phone.replace(/^\+91/, "")}`) {
        return res
          .status(400)
          .json({ message: "Email or Phone number is already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: firstName,
      lastName,
      email: email || undefined,
      phone: phone ? `+91${phone.replace(/^\+91/, "")}` : undefined,
      password: hashedPassword,
      userType,
      role: userType.toLowerCase(),
      status: "Unverified",
    });

    await newUser.save();


    if (userType === "Seller") {
      const newBusinessProfile = new BusinessProfile({
        userId: newUser._id,
        businessName,
      });
      await newBusinessProfile.save();
      newUser.businessProfile = newBusinessProfile._id;
    } else if (userType === "Artist") {
      const newArtistDetails = new ArtistDetails({
        userId: newUser._id,
        artistName,
      });
      await newArtistDetails.save();
      newUser.artistDetails = newArtistDetails._id;
    }

    await newUser.save();


    try {
      await notifySuperAdmin(newUser, userType);
    } catch (notificationError) {
      console.error("Error notifying super-admin:", notificationError);
    }

    if (email) {
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


        let template;
        switch (userType.toLowerCase()) {
          case "artist":
            template = await EmailTemplate.findOne();
            break;
          case "seller":
            template = await NewSellerTemplate.findOne();
            break;
          case "buyer":
            template = await NewBuyerTemplate.findOne();
            break;
          default:
            template = {
              subject: "Welcome to Artsays!",
              content: `Hello {first_name},\n\nYour account has been created successfully.`,
              mail_from_name: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
            };
        }

        if (!template) {
          console.log(`No email template found for ${userType}`);
          template = {
            subject: "Account Created",
            content: "Your account has been successfully created.",
          };
        }

        // Replace placeholders
        const emailContent = template.content
          .replace("{first_name}", firstName)
          .replace("{last_name}", lastName)
          .replace("{user_type}", userType)
          .replace("{email}", email)
          .replace("{password}", password)
          .replace("{app_name}", "Artsays");


        const imagePath = path.join(
          __dirname,
          "../../../controllers/Email/Artsays.png"
        );
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

        const verificationNote = `
                <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <p style="margin: 0; color: #856404; font-weight: bold;">Important:</p>
                    <p style="margin: 10px 0 0 0; color: #856404;">
                        Your account is currently <strong>Unverified</strong>. Please complete your profile 
                        and submit required documents for verification. You will be notified once 
                        your account is verified.
                    </p>
                </div>
            `;

        const mailOptions = {
          from: `${template.mail_from_name || emailSettings.mailFromName} <${emailSettings.mailFromAddress
            }>`,
          to: email,
          subject: `Welcome to Artsays - Your ${userType} Account is Ready!`,
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
    <!-- Outer Container with background color -->
    <div class="outer-container" style="padding: 80px 0; background-color: #F8F1EE; width: 100%;">
        <!-- Email Container -->
        <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <!-- Header Section -->
            <div style="background: #AD6449; padding: 30px 20px; text-align: center; color: white;">
                <div style="margin-bottom: 20px;">
                    ${attachments.length > 0
              ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">`
              : ""
            }
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">${userType} Management Portal</h1>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">Dear ${firstName} ${lastName},</p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">Thank you for registering as a ${userType} on Artsays. We're excited to have you on board!</p>

                ${verificationNote}
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">Your account has been successfully created. Here are your login credentials:</p>
                
                <!-- Credentials Box -->
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 100px; color: #2d3748;">Email: ${email}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 100px; color: #2d3748;">Password: ${password}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 100px; color: #2d3748;">Account Type: ${userType}</span>
                    </div>
                </div>
                
                <!-- Action Button -->
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" style="display: inline-block; background: #AD6449; color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 600; margin: 20px 0; text-align: center;">Access Your Account</a>
                </div>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">For your security, we recommend changing your password after your first login.</p>
                
                <!-- Support Section -->
                <div style="margin-top: 20px; font-size: 15px;">
                    <p>If you have any questions or need assistance, feel free to reach out us.</p>
                </div>
                
                <!-- Signature -->
                <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #E2D5D0;">
                    <p>Best regards,</p>
                    <p><strong>The Artsays Team</strong></p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; background: #F4ECE9; font-size: 14px; color: #7A5C50;">
                <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
            `,
          attachments: [...attachments],
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send welcome email:", {
          error: emailError.message,
          stack: emailError.stack,
        });
      }
    }
    res.status(201).json({
      success: true,
      message: `${userType} account created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.userType,
        role: newUser.role,
        status: newUser.status,
        ...(userType === "Seller" && {
          businessProfile: newUser.businessProfile,
        }),
        ...(userType === "Artist" && { artistDetails: newUser.artistDetails }),
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = createuser;
