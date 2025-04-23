// const Bidding = require('../../../Models/bidding');

// const createBid = async (req, res) => {
//   try {
//     const { user, product, startingBid } = req.body;


//     if (!user || !product || !startingBid) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newBid = new Bidding({
//       user,
//       product,
//       startingBid,
//       currentBid: null,
//       endBid: null,
//       status: 'Pending',
//     });

//     const savedBid = await newBid.save();

//     return res.status(201).json({
//       message: 'Bid created successfully',
//       bid: savedBid,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = createBid;

const Bidding = require('../../../Models/bidding');
const User = require('../../../Models/usermode');
const nodemailer = require('nodemailer');
const EmailSetting = require('../../../Models/EmailSetting');
const path = require('path');
const fs = require('fs');

const createBid = async (req, res) => {
  try {
    const { user, product, startingBid } = req.body;

    if (!user || !product || !startingBid) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBid = new Bidding({
      user,
      product,
      startingBid,
      currentBid: null,
      endBid: null,
      status: 'Pending',
    });

    const savedBid = await newBid.save();

    // Get user details and find super admin
    const bidCreator = await User.findById(user);
    const superAdmins = await User.find({ role: 'super-admin' });

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

        // Email content for bid creator
        const creatorMailOptions = {
          from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
          to: bidCreator.email,
          subject: `Your Bid Has Been Created Successfully - Bid #${savedBid._id}`,
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
                    Bid Created Successfully
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${bidCreator.name || 'User'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    Thank you for creating a new bid on Artsays. Your bid has been successfully submitted and is currently in <strong>Pending</strong> status.
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Bid ID:</span>
                        <span>${savedBid._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Starting Bid:</span>
                        <span>$${savedBid.startingBid}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Status:</span>
                        <span style="color: #FFA000; font-weight: 600;">Pending</span>
                    </div>
                </div>

                <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #2E7D32; font-weight: bold;">Next Steps</p>
                    <p style="margin: 10px 0 0 0; color: #2E7D32;">
                        Your bid will be reviewed by our team. Once approved, it will become active and visible to other users.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Your Bid
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

        // Email content for super admins
        const adminMailOptions = {
          from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
          to: superAdmins.map(admin => admin.email).join(','),
          subject: `New Bid Created - Requires Approval - Bid #${savedBid._id}`,
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
                    New Bid Requires Approval
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear Admin Team,
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    A new bid has been created by ${bidCreator.name || 'a user'} and requires your approval.
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Bid ID:</span>
                        <span>${savedBid._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Created By:</span>
                        <span>${bidCreator.name || 'Unknown User'} (${bidCreator.email})</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Starting Bid:</span>
                        <span>$${savedBid.startingBid}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Status:</span>
                        <span style="color: #FFA000; font-weight: 600;">Pending Approval</span>
                    </div>
                </div>

                <div style="background-color: #E3F2FD; border-left: 4px solid #1976D2; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #0D47A1; font-weight: bold;">Action Required</p>
                    <p style="margin: 10px 0 0 0; color: #0D47A1;">
                        Please review this bid and approve or reject it in the admin dashboard.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        Review Bid
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

        // Send emails
        await transporter.sendMail(creatorMailOptions);
        console.log(`Bid confirmation email sent to creator: ${bidCreator.email}`);

        if (superAdmins.length > 0) {
          await transporter.sendMail(adminMailOptions);
          console.log(`Bid notification email sent to super admins`);
        }
      }
    } catch (emailError) {
      console.error("Failed to send bid creation emails:", emailError);
    }

    return res.status(201).json({
      message: 'Bid created successfully',
      bid: savedBid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createBid;
