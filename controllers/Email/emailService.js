const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_ENCRYPTION === 'ssl', 
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {

    rejectUnauthorized: false
  }
});

const sendEmailOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, 
      to: email,
      subject: 'Your Password Reset OTP',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Password Reset OTP</title>
      </head>
      <body style="margin: 0; padding: 50px 20px; background-color: #f2f2f2; font-family: Arial, sans-serif;">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background-color: rgba(255,255,255,0.92);
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        ">
          <h2 style="
            text-align: center;
            color: #6b4f36;
            margin-top: 0;
            margin-bottom: 24px;
          ">
            🔐 Password Reset Request
          </h2>

          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            We received a request to reset your password. Use the following OTP to proceed:
          </p>

          <div style="
            background-color: #fdf8f6;
            border: 2px dashed #6b4f36;
            color: #6b4f36;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            padding: 20px;
            border-radius: 10px;
            margin: 25px 0;
          ">
            ${otp}
          </div>

          <p style="font-size: 15px; color: #555; margin-bottom: 30px;">
            This OTP is valid for <strong>10 minutes</strong>. If you didn’t request this, please ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #e0dcd7; margin: 30px 0;" />

          <p style="text-align: center; font-size: 14px; color: #999;">
            &mdash; The <strong style="color: #6b4f36;">${process.env.APP_NAME}</strong> Team
          </p>
        </div>
      </body>
      </html>
    `,
  };
    //   html: `
    //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //     <h2 style="color: #6b4f36;">Password Reset Request</h2>
    //     <p>We received a request to reset your password. Use the following OTP to proceed:</p>
    //     <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 2px; color: #6b4f36; font-weight: bold;">
    //       ${otp}
    //     </div>
    //     <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
    //     <p style="margin-top: 30px; color: #777;">The ${process.env.APP_NAME} Team</p>
    //   </div>
    // `,
    // };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Full error details:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

module.exports =  sendEmailOTP ;



// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   secure: process.env.MAIL_ENCRYPTION === 'ssl', 
//   auth: {
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// const sendEmailOTP = async (email, otp) => {
//   try {
//     const mailOptions = {
//       from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
//       to: email,
//       subject: 'Your Password Reset OTP',
//       html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <!-- Use cid:reference -->
//         <img src="cid:logo" alt="Logo" style="max-width: 200px; display: block; margin: 0 auto;">
//         <h2 style="color: #6b4f36;">Password Reset Request</h2>
//         <p>Your OTP is: <strong>${otp}</strong></p>
//       </div>
//       `,
//       attachments: [{
//         filename: 'logo.png',
//         path: 'C:/Users/ASUS/OneDrive/Desktop/Project/Artsays1/ByteCraft-Artsays-Backend/controllers/Email/img.png',
//         cid: 'logo' // Must match <img src="cid:logo">
//       }]
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`Message sent: ${info.messageId}`);
//     return true;
//   } catch (error) {
//     console.error('Full error details:', error);
//     throw new Error(`Failed to send OTP email: ${error.message}`);
//   }
// };

// module.exports = sendEmailOTP;