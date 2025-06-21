const BuyerRequest = require("../../../Models/Buyercustomrequest");
const User = require("../../../Models/usermode");
const nodemailer = require("nodemailer");
const EmailSetting = require("../../../Models/EmailSetting");
const path = require("path");
const fs = require("fs");

const updateBuyerRequestByBuyerId = async (req, res) => {
  try {
    const requestId = req.params.id;
    const {
      ProductName,
      Description,
      NegotiatedBudget,
      MaxBudget,
      MinBudget,
      BuyerNotes,
      rejectedcomment,
      BuyerStatus,
    } = req.body;

    const existingRequest = await BuyerRequest.findById(requestId).populate(
      "Artist.id",
      "name email"
    );

    if (!existingRequest) {
      return res.status(404).json({
        message: "No buyer request found with the provided ID.",
      });
    }

    // Validate NegotiatedBudget
    if (NegotiatedBudget) {
      if (!Array.isArray(NegotiatedBudget)) {
        return res.status(400).json({
          message: "NegotiatedBudget must be an array.",
        });
      }

      for (const budget of NegotiatedBudget) {
        if (
          typeof budget.amount !== "number" ||
          !["buyer", "artist"].includes(budget.updatedBy)
        ) {
          return res.status(400).json({
            message:
              "Each NegotiatedBudget entry must have a valid amount (number) and updatedBy (buyer or artist).",
          });
        }
      }
    }

    let updateFields = { rejectedcomment, BuyerStatus };

    if (
      ProductName ||
      Description ||
      NegotiatedBudget ||
      MaxBudget ||
      MinBudget ||
      BuyerNotes
    ) {
      if (existingRequest.updateCount >= 2) {
        return res.status(400).json({
          message:
            "This buyer request has already been updated and cannot be updated again.",
        });
      }

      updateFields = {
        ...updateFields,
        ProductName,
        Description,
        NegotiatedBudget,
        MaxBudget,
        MinBudget,
        BuyerNotes,
      };
    }

    const updatedRequest = await BuyerRequest.findByIdAndUpdate(
      requestId,
      {
        $set: updateFields,
        ...(Object.keys(updateFields).some((field) =>
          [
            "ProductName",
            "Description",
            "NegotiatedBudget",
            "MaxBudget",
            "MinBudget",
            "BuyerNotes",
          ].includes(field)
        ) && { $inc: { updateCount: 1 } }),
      },
      { new: true }
    ).populate("Artist.id", "name email");

    // Send email notification only to artist if status changed to Approved/Rejected
    if (["Approved", "Rejected"].includes(BuyerStatus)) {
      try {
        const emailSettings = await EmailSetting.findOne();
        if (emailSettings && updatedRequest.Artist.id.email) {
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

          const statusColor = BuyerStatus === "Approved" ? "#28a745" : "#dc3545";
          const statusMessage =
            BuyerStatus === "Approved"
              ? "The buyer has approved your proposal! Please proceed with the order as per agreed terms."
              : "The buyer has rejected the proposal. Please review the comments below.";

          const mailOptions = {
            from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
            to: updatedRequest.Artist.id.email,
            subject: `Your Proposal Has Been ${BuyerStatus} - ${updatedRequest.ProductName}`,
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
                    ${
                      attachments.length > 0
                        ? `<img src="cid:artsays_logo" alt="Artsays Logo" style="width: 250px; height: auto;">`
                        : ""
                    }
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white;">
                    Proposal ${BuyerStatus}
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${updatedRequest.Artist.id.name || "Artist"},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    ${statusMessage}
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Product:</span>
                        <span>${updatedRequest.ProductName}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Request ID:</span>
                        <span>${updatedRequest._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Status:</span>
                        <span style="color: ${statusColor}; font-weight: 600;">${BuyerStatus}</span>
                    </div>
                    ${
                      BuyerStatus === "Rejected" && updatedRequest.rejectedcomment
                        ? `
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Reason:</span>
                        <span>${updatedRequest.rejectedcomment}</span>
                    </div>
                    `
                        : ""
                    }
                </div>

                ${
                  BuyerStatus === "Rejected"
                    ? `
                <div style="background-color: #FFF3E0; border-left: 4px solid #FFA000; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #E65100; font-weight: bold;">Next Steps</p>
                    <p style="margin: 10px 0 0 0; color: #E65100;">
                        Please review the buyer's comments and consider submitting a revised proposal.
                    </p>
                </div>
                `
                    : ""
                }
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/dashboard" 
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
            `,
            attachments,
          };

          await transporter.sendMail(mailOptions);
          console.log(
            `Status update email sent to artist: ${updatedRequest.Artist.id.email}`
          );
        }
      } catch (emailError) {
        console.error("Failed to send status email to artist:", emailError);
      }
    }

    res.status(200).json({
      message: "Buyer request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating the buyer request",
      error: error.message,
    });
  }
};

module.exports = updateBuyerRequestByBuyerId;