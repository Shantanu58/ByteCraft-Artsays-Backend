// const BiddedProduct = require('../../../Models/biddedproduct');

// const createBiddedProduct = async (req, res) => {
//   try {
//     const { buyer, product, totalPrice, paymentMethod } = req.body;


//     if (!buyer || !product || !totalPrice || !paymentMethod) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     const newBiddedProduct = new BiddedProduct({
//       buyer,
//       product,
//       totalPrice,
//       paymentMethod,
//     });

//     await newBiddedProduct.save();
//     res.status(201).json({ success: true, message: 'Bidded product created successfully', product: newBiddedProduct });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// module.exports = createBiddedProduct;

const BiddedProduct = require('../../../Models/biddedproduct');
const User = require('../../../Models/usermode');
const Bidding = require('../../../Models/bidding');
const nodemailer = require('nodemailer');
const EmailSetting = require('../../../Models/EmailSetting');
const path = require('path');
const fs = require('fs');

const createBiddedProduct = async (req, res) => {
  try {
    const { buyer, product, totalPrice, paymentMethod } = req.body;

    if (!buyer || !product || !totalPrice || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Fetch all necessary user and product data
    const [buyerUser, productDetails, superAdmins] = await Promise.all([
      User.findById(buyer),
      Bidding.findById(product).populate('user', 'name email'),
      User.find({ role: 'super-admin' })
    ]);

    if (!buyerUser) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }

    if (!productDetails) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const productOwner = await User.findById(productDetails.user);
    if (!productOwner) {
      return res.status(404).json({ success: false, message: 'Product owner not found' });
    }

    const newBiddedProduct = new BiddedProduct({
      buyer,
      product,
      totalPrice,
      paymentMethod,
    });

    const savedBiddedProduct = await newBiddedProduct.save();

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

        // Email content for buyer
        const buyerMailOptions = {
          from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
          to: buyerUser.email,
          subject: `Your Bid Purchase Confirmation - Order #${savedBiddedProduct.transactionId}`,
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
                    Bid Purchase Confirmation
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${buyerUser.name || 'Valued Customer'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    Thank you for your successful bid purchase on Artsays. We're excited to let you know that your order has been confirmed.
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Order ID:</span>
                        <span>${savedBiddedProduct.transactionId}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Product:</span>
                        <span>Bid #${productDetails._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Total Amount:</span>
                        <span>$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Payment Method:</span>
                        <span>${paymentMethod}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Purchase Date:</span>
                        <span>${new Date(savedBiddedProduct.biddedDate).toLocaleString()}</span>
                    </div>
                </div>

                <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #2E7D32; font-weight: bold;">Next Steps</p>
                    <p style="margin: 10px 0 0 0; color: #2E7D32;">
                        The seller will now prepare your item for shipping. You'll receive another email with tracking information once it's dispatched.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Your Order
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

        // Email content for product owner (seller)
        const sellerMailOptions = {
          from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
          to: productOwner.email,
          subject: `Your Product Has Been Sold - Order #${savedBiddedProduct.transactionId}`,
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
                    Congratulations! Your Product Sold
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear ${productOwner.name || 'Artist'},
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    We're excited to inform you that your product has been successfully sold through our bidding system.
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Order ID:</span>
                        <span>${savedBiddedProduct.transactionId}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Product:</span>
                        <span>Bid #${productDetails._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Sold Price:</span>
                        <span>$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Buyer:</span>
                        <span>${buyerUser.name}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Sale Date:</span>
                        <span>${new Date(savedBiddedProduct.biddedDate).toLocaleString()}</span>
                    </div>
                </div>

                <div style="background-color: #E3F2FD; border-left: 4px solid #1976D2; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #0D47A1; font-weight: bold;">Next Steps</p>
                    <p style="margin: 10px 0 0 0; color: #0D47A1;">
                        Please prepare the item for shipping. You'll receive further instructions about shipping and payment processing shortly.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Order Details
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
          subject: `New Bid Purchase - Order #${savedBiddedProduct.transactionId}`,
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
                    New Bid Purchase Completed
                </h1>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #2d3748;">
                    Dear Admin Team,
                </p>
                
                <p style="margin-bottom: 25px; font-size: 16px; color: #4a5568;">
                    A new bid purchase has been completed on Artsays. Here are the details:
                </p>
                
                <div style="background: #F4ECE9; border-left: 4px solid #AD6449; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Order ID:</span>
                        <span>${savedBiddedProduct.transactionId}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Product:</span>
                        <span>Bid #${productDetails._id}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Buyer:</span>
                        <span>${buyerUser.name} (${buyerUser.email})</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Seller:</span>
                        <span>${productOwner.name} (${productOwner.email})</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Amount:</span>
                        <span>$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Payment Method:</span>
                        <span>${paymentMethod}</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex;">
                        <span style="font-weight: 600; min-width: 150px; color: #2d3748;">Purchase Date:</span>
                        <span>${new Date(savedBiddedProduct.biddedDate).toLocaleString()}</span>
                    </div>
                </div>

                <div style="background-color: #FFF3E0; border-left: 4px solid #FB8C00; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #E65100; font-weight: bold;">Admin Notice</p>
                    <p style="margin: 10px 0 0 0; color: #E65100;">
                        This is an informational email. No action is required unless you notice any discrepancies.
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" 
                       style="display: inline-block; background: #AD6449; color: white !important; 
                              text-decoration: none; padding: 12px 30px; border-radius: 4px; 
                              font-weight: 600; margin: 20px 0; text-align: center;">
                        View Order Details
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

        // Send all emails
        await Promise.all([
          transporter.sendMail(buyerMailOptions),
          transporter.sendMail(sellerMailOptions),
          superAdmins.length > 0 ? transporter.sendMail(adminMailOptions) : Promise.resolve()
        ]);

        console.log('Bid purchase confirmation emails sent successfully');
      }
    } catch (emailError) {
      console.error("Failed to send bid purchase emails:", emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Bidded product created successfully', 
      product: savedBiddedProduct 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = createBiddedProduct;
