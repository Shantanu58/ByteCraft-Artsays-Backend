// const Bidding = require('../../../Models/bidding');

// const updateBid = async (req, res) => {
//   try {
//     const { bidId } = req.params;
//     const { currentBid, status } = req.body;

//     if (!bidId) {
//       return res.status(400).json({ message: 'Bid ID is required' });
//     }

//     const bid = await Bidding.findById(bidId);

//     if (!bid) {
//       return res.status(404).json({ message: 'Bid not found' });
//     }

//     if (status === 'Ended') {
//       bid.status = 'Ended';
//       bid.endBid = bid.currentBid;
//       await bid.save();

//       return res.status(200).json({
//         message: 'Bid status updated to ended',
//         bid,
//       });
//     }

//     if (currentBid !== undefined) {
//       if (bid.currentBid !== null && currentBid <= bid.currentBid) {
//         return res.status(400).json({ message: 'Current bid must be higher than the previous bid' });
//       }

//       bid.currentBid = currentBid;

//       if (bid.status === 'Pending') {
//         bid.status = 'Active';
//       }

//       await bid.save();

//       return res.status(200).json({
//         message: 'Bid updated successfully',
//         bid,
//       });
//     }

//     return res.status(400).json({ message: 'No valid update fields provided' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = updateBid;

const Bidding = require('../../../Models/bidding');
const User = require('../../../Models/usermode');
const nodemailer = require('nodemailer');
const EmailSetting = require('../../../Models/EmailSetting');
const path = require('path');
const fs = require('fs');

const updateBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { currentBid, status, updatedBy } = req.body;

    if (!bidId) {
      return res.status(400).json({ message: 'Bid ID is required' });
    }

    if (!updatedBy) {
      return res.status(400).json({ message: 'Updated by user ID is required' });
    }

    const bid = await Bidding.findById(bidId).populate('user', 'name email');
    const updatingUser = await User.findById(updatedBy);
    const superAdmins = await User.find({ role: 'super-admin' });

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    if (!updatingUser) {
      return res.status(404).json({ message: 'Updating user not found' });
    }

    let updateMessage = '';
    const previousStatus = bid.status;
    const previousBid = bid.currentBid;

    if (status === 'Ended') {
      bid.status = 'Ended';
      bid.endBid = bid.currentBid;
      updateMessage = 'Bid status updated to ended';
      await bid.save();
    } else if (currentBid !== undefined) {
      if (bid.currentBid !== null && currentBid <= bid.currentBid) {
        return res.status(400).json({ message: 'Current bid must be higher than the previous bid' });
      }

      bid.currentBid = currentBid;
      updateMessage = 'Bid amount updated successfully';

      if (bid.status === 'Pending') {
        bid.status = 'Active';
      }

      await bid.save();
    } else {
      return res.status(400).json({ message: 'No valid update fields provided' });
    }

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
          to: bid.user.email,
          subject: `Your Bid Has Been Updated - Bid #${bid._id}`,
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
                    Bid Update Notification
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${bid.user.name || 'User'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    Your bid on Artsays has been updated by ${updatingUser.name}.
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Bid ID:</span>
                        <span>${bid._id}</span>
                    </div>
                    ${previousBid !== null ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Previous Bid:</span>
                        <span>$${previousBid}</span>
                    </div>
                    ` : ''}
                    ${bid.currentBid !== null ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Current Bid:</span>
                        <span>$${bid.currentBid}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Previous Status:</span>
                        <span style="color: ${previousStatus === 'Active' ? '#4CAF50' : '#FFA000'}; font-weight: 600;">${previousStatus}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Current Status:</span>
                        <span style="color: ${bid.status === 'Active' ? '#4CAF50' : bid.status === 'Ended' ? '#F44336' : '#FFA000'}; font-weight: 600;">${bid.status}</span>
                    </div>
                </div>

                <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #2E7D32; font-weight: bold;">Bid Details</p>
                    <p style="margin: 10px 0 0 0; color: #2E7D32;">
                        ${bid.status === 'Ended' ? 
                          'This bid has been completed. Thank you for participating.' : 
                          'You can view the updated bid details in your account.'}
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

        // Email content for updating user (if not the creator)
        let updatingUserMailOptions;
        if (updatingUser._id.toString() !== bid.user._id.toString()) {
          updatingUserMailOptions = {
            from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
            to: updatingUser.email,
            subject: `Bid Update Confirmation - Bid #${bid._id}`,
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
                    Bid Update Confirmation
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${updatingUser.name || 'User'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    You have successfully updated the bid created by ${bid.user.name}.
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Bid ID:</span>
                        <span>${bid._id}</span>
                    </div>
                    ${previousBid !== null ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Previous Bid:</span>
                        <span>$${previousBid}</span>
                    </div>
                    ` : ''}
                    ${bid.currentBid !== null ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Current Bid:</span>
                        <span>$${bid.currentBid}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Previous Status:</span>
                        <span style="color: ${previousStatus === 'Active' ? '#4CAF50' : '#FFA000'}; font-weight: 600;">${previousStatus}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Current Status:</span>
                        <span style="color: ${bid.status === 'Active' ? '#4CAF50' : bid.status === 'Ended' ? '#F44336' : '#FFA000'}; font-weight: 600;">${bid.status}</span>
                    </div>
                </div>

                <div style="background-color: #E3F2FD; border-left: 4px solid #1976D2; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #0D47A1; font-weight: bold;">Update Summary</p>
                    <p style="margin: 10px 0 0 0; color: #0D47A1;">
                        ${bid.status === 'Ended' ? 
                          'You have marked this bid as completed.' : 
                          'The bid details have been successfully updated.'}
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Updated Bid
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
        }

        // Email content for super admins
        const adminMailOptions = {
          from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
          to: superAdmins.map(admin => admin.email).join(','),
          subject: `Bid Updated - Bid #${bid._id}`,
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
                    Bid Update Notification
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear Admin Team,
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    A bid has been updated by ${updatingUser.name} (${updatingUser.role}).
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Bid ID:</span>
                        <span>${bid._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Created By:</span>
                        <span>${bid.user.name} (${bid.user.email})</span>
                    </div>
                    ${previousBid !== null ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Previous Bid:</span>
                        <span>$${previousBid}</span>
                    </div>
                    ` : ''}
                    ${bid.currentBid !== null ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Current Bid:</span>
                        <span>$${bid.currentBid}</span>
                    </div>
                    ` : ''}
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Previous Status:</span>
                        <span style="color: ${previousStatus === 'Active' ? '#4CAF50' : '#FFA000'}; font-weight: 600;">${previousStatus}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Current Status:</span>
                        <span style="color: ${bid.status === 'Active' ? '#4CAF50' : bid.status === 'Ended' ? '#F44336' : '#FFA000'}; font-weight: 600;">${bid.status}</span>
                    </div>
                </div>

                <div style="background-color: #FFF3E0; border-left: 4px solid #FB8C00; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #E65100; font-weight: bold;">Admin Notice</p>
                    <p style="margin: 10px 0 0 0; color: #E65100;">
                        This is an informational email. No action is required unless you suspect unauthorized changes.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Bid Details
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
        console.log(`Bid update email sent to creator: ${bid.user.email}`);

        if (updatingUserMailOptions && updatingUser._id.toString() !== bid.user._id.toString()) {
          await transporter.sendMail(updatingUserMailOptions);
          console.log(`Bid update confirmation email sent to updater: ${updatingUser.email}`);
        }

        if (superAdmins.length > 0) {
          await transporter.sendMail(adminMailOptions);
          console.log(`Bid update notification email sent to super admins`);
        }
      }
    } catch (emailError) {
      console.error("Failed to send bid update emails:", emailError);
    }

    return res.status(200).json({
      message: updateMessage,
      bid,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateBid;
