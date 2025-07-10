// const BuyerRequest = require("../../../Models/Buyercustomrequest");
// const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");

// const createBuyerRequest = async (req, res) => {
//     try {

//         const { error } = buyerRequestValidator.validate(req.body);
//         if (error) {
//             return res.status(400).json({ 
//                 message: error.details[0].message 
//             });
//         }


//         const { 
//             ProductName, 
//             Description, 
//             ArtType, 
//             Size, 
//             ColourPreferences, 
//             IsFramed, 
//             MinBudget, 
//             MaxBudget, 
//             PaymentTerm, 
//             ExpectedDeadline, 
//             Comments,
//             Artist 
//         } = req.body;


//         const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;

//         if (!BuyerImage) {
//             return res.status(400).json({ 
//                 message: "Reference image is required" 
//             });
//         }

//         const BuyerId = req.userID;
//         const artistId = typeof Artist === 'string' ? { id: Artist } : Artist;


//         const newBuyerRequest = new BuyerRequest({
//             ProductName,
//             Description,
//             BuyerImage,
//             ArtType,
//             Size,
//             ColourPreferences: JSON.parse(ColourPreferences),
//             IsFramed,
//             MinBudget: parseFloat(MinBudget),
//             MaxBudget: parseFloat(MaxBudget),
//             PaymentTerm,
//             ExpectedDeadline: parseInt(ExpectedDeadline),
//             Comments,
//             Artist: artistId,
//             Buyer: { 
//                 id: BuyerId,

//             },
//             RequestStatus: 'Pending', 
//         });

//         // Validate budget range
//         if (newBuyerRequest.MaxBudget <= newBuyerRequest.MinBudget) {
//             return res.status(400).json({ 
//                 message: "Maximum budget must be greater than minimum budget" 
//             });
//         }

//         await newBuyerRequest.save();

//         res.status(201).json({
//             message: "Buyer request created successfully",
//             buyerRequest: newBuyerRequest,
//         });
//     } catch (error) {
//         console.error("Error creating buyer request:", error);
//         res.status(500).json({
//             message: "Error creating buyer request",
//             error: error.message,
//         });
//     }
// };

// module.exports = createBuyerRequest;

const BuyerRequest = require("../../../Models/Buyercustomrequest");
const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");
const User = require("../../../Models/usermode");
const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const path = require("path");
const fs = require("fs");

// Helper function to send email notifications
// const sendBuyerRequestNotification = async (request, recipientType) => {
//   try {
//     const emailSettings = await EmailSetting.findOne();
//     if (!emailSettings) {
//       console.log("No email settings found in database");
//       return;
//     }

//     const transporter = nodemailer.createTransport({
//       host: emailSettings.mailHost,
//       port: emailSettings.mailPort,
//       secure: emailSettings.mailEncryption === "SSL",
//       auth: {
//         user: emailSettings.mailUsername,
//         pass: emailSettings.mailPassword,
//       },
//     });

//     // Prepare image attachment
//     const imagePath = path.join(
//       __dirname,
//       "../../../controllers/Email/Artsays.png"
//     );
//     let attachments = [];

//     if (fs.existsSync(imagePath)) {
//       attachments.push({
//         filename: "artsays-logo.png",
//         path: imagePath,
//         cid: "artsays_logo",
//       });
//     }

//     // Get recipient details based on type
//     let recipients = [];
//     let subject = "";
//     let content = "";

//     switch (recipientType) {
//       case "super-admin":
//         const superAdmins = await User.find({ role: "super-admin" });
//         recipients = superAdmins.map(admin => admin.email);
//         subject = `New Custom Art Request - Requires Approval`;
//         content = `
//           <p>A new custom art request has been submitted by ${request.Buyer.name}.</p>
//           <p><strong>Request Details:</strong></p>
//           <ul>
//             <li>Product: ${request.ProductName}</li>
//             <li>Art Type: ${request.ArtType}</li>
//             <li>Budget Range: ${request.MinBudget} - ${request.MaxBudget}</li>
//             <li>Deadline: ${request.ExpectedDeadline} days</li>
//           </ul>
//           <p>Please review and approve this request in the admin dashboard.</p>
//         `;
//         break;

//       case "artist":
//         const artist = await User.findById(request.Artist.id);
//         if (artist && artist.email) {
//           recipients = [artist.email];
//           subject = `New Custom Art Request - ${request.ProductName}`;
//           content = `
//             <p>Dear ${artist.name},</p>
//             <p>A new custom art request has been assigned to you:</p>
//             <p><strong>${request.ProductName}</strong></p>
//             <p>${request.Description}</p>
//             <p><strong>Details:</strong></p>
//             <ul>
//               <li>Art Type: ${request.ArtType}</li>
//               <li>Size: ${request.Size}</li>
//               <li>Budget: ${request.MinBudget} - ${request.MaxBudget}</li>
//               <li>Deadline: ${request.ExpectedDeadline} days</li>
//             </ul>
//             <p>Please review this request and respond accordingly.</p>
//           `;
//         }
//         break;

//       case "buyer":
//         const buyer = await User.findById(request.Buyer.id);
//         if (buyer && buyer.email) {
//           recipients = [buyer.email];
//           subject = `Your Custom Art Request Has Been Submitted`;
//           content = `
//             <p>Dear ${buyer.name},</p>
//             <p>Your custom art request has been successfully submitted:</p>
//             <p><strong>${request.ProductName}</strong></p>
//             <p>Our team will review your request and get back to you soon.</p>
//             <p><strong>Request Details:</strong></p>
//             <ul>
//               <li>Art Type: ${request.ArtType}</li>
//               <li>Size: ${request.Size}</li>
//               <li>Budget: ${request.MinBudget} - ${request.MaxBudget}</li>
//               <li>Expected Completion: ${request.ExpectedDeadline} days</li>
//             </ul>
//             <p>Thank you for choosing Artsays!</p>
//           `;
//         }
//         break;
//     }

//     if (recipients.length === 0) {
//       console.log(`No recipients found for ${recipientType} notification`);
//       return;
//     }

//     const mailOptions = {
//         from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
//         to: recipients.join(","),
//         subject: subject,
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head>
//               <meta charset="UTF-8">
//               <meta name="viewport" content="width=device-width, initial-scale=1.0">
//               <style>
//                 @media only screen and (max-width: 600px) {
//                   .outer-container {
//                     padding: 0px 0 !important;
//                   }
//                   .email-container {
//                     border-radius: 0 !important;
//                   }
//                   .credentials-box {
//                     padding: 15px !important;
//                   }
//                   .action-button {
//                     padding: 10px 20px !important;
//                   }
//                 }

//                 body {
//                   margin: 0;
//                   padding: 0;
//                   font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
//                   line-height: 1.6;
//                   color: #333333;
//                   background-color: #f2f2f2;
//                 }

//                 .credentials-box {
//                   background: rgb(244, 236, 233);
//                   border-left: 4px solid rgb(173, 100, 73);
//                   padding: 20px;
//                   margin: 25px 0;
//                   border-radius: 4px;
//                 }

//                 .action-button {
//                   display: inline-block;
//                   background: rgb(173, 100, 73);
//                   color: white !important;
//                   text-decoration: none;
//                   padding: 12px 30px;
//                   border-radius: 4px;
//                   font-weight: 600;
//                   margin: 20px 0;
//                   text-align: center;
//                 }

//                 .detail-item {
//                   margin-bottom: 12px;
//                   display: flex;
//                   flex-wrap: wrap;
//                 }

//                 .detail-label {
//                   font-weight: 600;
//                   min-width: 150px;
//                   color: #2d3748;
//                 }

//                 .detail-value {
//                   color: #4a5568;
//                 }
//               </style>
//           </head>
//           <body>
//               <!-- Outer Container with background color -->
//               <div class="outer-container" style="padding: 80px 0; background-color: #f2f2f2; width: 100%;">
//                   <!-- Email Container -->
//                   <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
//                       <!-- Header Section -->
//                       <div style="background: linear-gradient(135deg,rgb(204, 151, 121) 0%, rgb(204, 151, 121) 100%); padding: 30px 20px; text-align: center; color: white;">
//                           <div style="margin-bottom: 20px;">
//                               ${attachments.length > 0 ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ""}
//                           </div>
//                           <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: black;">Custom Art Request</h1>
//                       </div>

//                       <!-- Main Content -->
//                       <div style="padding: 30px;">
//                           <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">Dear ${recipientType === 'artist' ? artist.name : recipientType === 'buyer' ? buyer.name : 'Admin'},</p>

//                           ${content}

//                           <!-- Request Details Box -->
//                           <div class="credentials-box">
//                               <div class="detail-item">
//                                   <span class="detail-label">Product:</span>
//                                   <span class="detail-value">${request.ProductName}</span>
//                               </div>
//                               <div class="detail-item">
//                                   <span class="detail-label">Art Type:</span>
//                                   <span class="detail-value">${request.ArtType}</span>
//                               </div>
//                               <div class="detail-item">
//                                   <span class="detail-label">Size:</span>
//                                   <span class="detail-value">${request.Size}</span>
//                               </div>
//                               <div class="detail-item">
//                                   <span class="detail-label">Budget Range:</span>
//                                   <span class="detail-value">${request.MinBudget} - ${request.MaxBudget}</span>
//                               </div>
//                               <div class="detail-item">
//                                   <span class="detail-label">Deadline:</span>
//                                   <span class="detail-value">${request.ExpectedDeadline} days</span>
//                               </div>
//                               ${request.Description ? `
//                               <div class="detail-item" style="flex-direction: column;">
//                                   <span class="detail-label">Description:</span>
//                                   <span class="detail-value" style="margin-top: 5px;">${request.Description}</span>
//                               </div>
//                               ` : ''}
//                           </div>

//                           <!-- Action Button -->
//                           <div style="text-align: center;">
//                               <a href="http://localhost:3000/login" class="action-button">View Request</a>
//                           </div>

//                           <!-- Additional Notes -->
//                           ${recipientType === 'buyer' ? `
//                           <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
//                               Our team will review your request and get back to you soon. You'll be notified once an artist accepts your request.
//                           </p>
//                           ` : ''}

//                           ${recipientType === 'artist' ? `
//                           <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
//                               Please review this request and respond within 48 hours. You can accept or decline this request from your artist dashboard.
//                           </p>
//                           ` : ''}

//                           ${recipientType === 'super-admin' ? `
//                           <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
//                               Please review this request and ensure it meets our quality standards before it's assigned to an artist.
//                           </p>
//                           ` : ''}

//                           <!-- Support Section -->
//                           <div style="margin-top: 20px; font-size: 15px; color: #4a5568;">
//                               <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
//                           </div>

//                           <!-- Signature -->
//                           <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
//                               <p>Best regards,</p>
//                               <p><strong>The Artsays Team</strong></p>
//                           </div>
//                       </div>

//                       <!-- Footer -->
//                       <div style="text-align: center; padding: 20px; background:rgb(244, 236, 233); font-size: 14px; color: #718096;">
//                           <p>© ${new Date().getFullYear()} Artsays. All rights reserved.</p>
//                       </div>
//                   </div>
//               </div>
//           </body>
//           </html>
//         `,
//         attachments: [...attachments],
//       };

//     await transporter.sendMail(mailOptions);
//     console.log(`Notification sent to ${recipientType}`);
//   } catch (error) {
//     console.error(`Error sending ${recipientType} notification:`, error);
//   }
// };

const sendBuyerRequestNotification = async (request, recipientType) => {
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

    // Prepare image attachment
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

    // Get recipient details based on type
    let recipients = [];
    let subject = "";
    let greeting = "";
    let mainContent = "";
    let actionNote = "";
    let additionalNotes = "";

    const buyer = await User.findById(request.Buyer.id);
    const artist = await User.findById(request.Artist.id);

    switch (recipientType) {
      case "super-admin":
        const superAdmins = await User.find({ role: "super-admin" });
        recipients = superAdmins.map(admin => admin.email);
        subject = `New Custom Art Request - Requires Approval`;
        greeting = `Dear Admin,`;
        mainContent = `
           <div style="margin-top: 14px; font-size: 15px; color: #4a5568;">
            <p>A new custom product request has been submitted by ${buyer?.name || 'a buyer'}.</p>
            <p>Please review and approve this request in the admin dashboard.</p>
          `;
        actionNote = `<p>Please review this request and ensure it meets our quality standards before it's assigned to an artist.</p></div>`;
        break;

      case "artist":
        if (artist && artist.email) {
          recipients = [artist.email];
          subject = `New Custom Art Request - ${request.ProductName}`;
          greeting = `Dear ${artist.name},`;
          mainContent = `
             <div style="margin-top: 20px; font-size: 15px; color: #4a5568;">
              <p>A new custom product request has been assigned to you by ${buyer.name}:</p>
             </div>`;
        }
        break;

      case "buyer":
        if (buyer && buyer.email) {
          recipients = [buyer.email];
          subject = `Your Custom Art Request Has Been Submitted`;
          greeting = `Dear ${buyer.name},`;
          mainContent = `
             <div style="margin-top: 20px; font-size: 15px; color: #4a5568;">
              <p>Your custom product request has been successfully submitted:</p>
              <p>Our team will review your request and get back to you soon.</p>
            `;
          additionalNotes = `
              <p>You'll be notified once an artist <strong>Approved</strong> your request.</p>
              </div>
            `;

        }
        break;
    }

    if (recipients.length === 0) {
      console.log(`No recipients found for ${recipientType} notification`);
      return;
    }

    const mailOptions = {
      from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
      to: recipients.join(","),
      subject: subject,
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
                  .credentials-box {
                    padding: 15px !important;
                  }
                  .action-button {
                    padding: 10px 20px !important;
                  }
                }
                
                body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  background-color: #f2f2f2;
                }
                
                .credentials-box {
                  background: rgb(244, 236, 233);
                  border-left: 4px solid rgb(173, 100, 73);
                  padding: 20px;
                  margin: 25px 0;
                  border-radius: 4px;
                }
                
                .action-button {
                  display: inline-block;
                  background: rgb(173, 100, 73);
                  color: white !important;
                  text-decoration: none;
                  padding: 12px 30px;
                  border-radius: 4px;
                  font-weight: 600;
                  margin: 20px 0;
                  text-align: center;
                }
                
                .detail-item {
                  margin-bottom: 12px;
                  display: flex;
                  flex-wrap: wrap;
                }
                
                .detail-label {
                  font-weight: 600;
                  min-width: 150px;
                  color: #2d3748;
                }
                
                .detail-value {
                  color: #4a5568;
                }
              </style>
          </head>
          <body>
              <!-- Outer Container with background color -->
              <div class="outer-container" style="padding: 80px 0; background-color: #f2f2f2; width: 100%;">
                  <!-- Email Container -->
                  <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                      <!-- Header Section -->
                      <div style="background: linear-gradient(135deg,rgb(204, 151, 121) 0%, rgb(204, 151, 121) 100%); padding: 30px 20px; text-align: center; color: white;">
                          <div style="margin-bottom: 20px;">
                              ${attachments.length > 0 ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">` : ""}
                          </div>
                          <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: black;">Custom Art Request</h1>
                      </div>
                      
                      <!-- Main Content -->
                      <div style="padding: 30px;">
                          <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">${greeting}</p>
                          
                          ${mainContent}
                          
                          <!-- Request Details Box -->
                          <div class="credentials-box">
                              <div class="detail-item">
                                  <span class="detail-label">Product:</span>
                                  <span class="detail-value">${request.ProductName}</span>
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Art Type:</span>
                                  <span class="detail-value">${request.ArtType}</span>
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Size:</span>
                                  <span class="detail-value">${request.Size}</span>
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Budget Range:</span>
                                  <span class="detail-value">${request.MinBudget} - ${request.MaxBudget}</span>
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Deadline:</span>
                                  <span class="detail-value">${request.ExpectedDeadline} days</span>
                              </div>
                          </div>
                          
                          <!-- Action Button -->
                          <div style="text-align: center;">
                              <a href="http://localhost:3000/login" class="action-button">View Request</a>
                          </div>
                          
                          ${actionNote ? actionNote : ''}
                          
                          ${additionalNotes ? additionalNotes : ''}
                          
                          <!-- Support Section -->
                          <div style="margin-top: 20px; font-size: 15px; color: #4a5568;">
                              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
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
      attachments: [...attachments],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${recipientType}`);
  } catch (error) {
    console.error(`Error sending ${recipientType} notification:`, error);
  }
};

const createBuyerRequest = async (req, res) => {
  try {
    const { error } = buyerRequestValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const {
      ProductName,
      Description,
      ArtType,
      Size,
      ColourPreferences,
      IsFramed,
      MinBudget,
      MaxBudget,
      PaymentTerm,
      InstallmentDuration,
      ExpectedDeadline,
      Comments,
      Artist
    } = req.body;
    const BuyerSelectedAddress = req.body.BuyerSelectedAddress || {
      line1: '',
      line2: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    };
    const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;

    if (!BuyerImage) {
      return res.status(400).json({
        message: "Reference image is required"
      });
    }

    const BuyerId = req.userID;
    const artistId = typeof Artist === 'string' ? { id: Artist } : Artist;

    const buyer = await User.findById(BuyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const artist = await User.findById(artistId.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const newBuyerRequest = new BuyerRequest({
      ProductName,
      Description,
      BuyerImage,
      ArtType,
      Size,
      ColourPreferences: JSON.parse(ColourPreferences),
      IsFramed,
      MinBudget: parseFloat(MinBudget),
      MaxBudget: parseFloat(MaxBudget),
      PaymentTerm,
      InstallmentDuration,
      ExpectedDeadline: parseInt(ExpectedDeadline),
      Comments,
      Artist: {
        id: artist._id,
        name: artist.name
      },
      Buyer: {
        id: buyer._id,
        name: buyer.name,
        email: buyer.email
      },
      BuyerSelectedAddress,
      RequestStatus: 'Pending',
    });

    if (newBuyerRequest.MaxBudget <= newBuyerRequest.MinBudget) {
      return res.status(400).json({
        message: "Maximum budget must be greater than minimum budget"
      });
    }
    await newBuyerRequest.save();

    // Send notifications to all parties
    try {
      await sendBuyerRequestNotification(newBuyerRequest, "super-admin");
      await sendBuyerRequestNotification(newBuyerRequest, "artist");
      await sendBuyerRequestNotification(newBuyerRequest, "buyer");
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError);
    }

    res.status(201).json({
      message: "Buyer request created successfully",
      buyerRequest: newBuyerRequest,
    });
  } catch (error) {
    console.error("Error creating buyer request:", error);
    res.status(500).json({
      message: "Error creating buyer request",
      error: error.message,
    });
  }
};

module.exports = createBuyerRequest;