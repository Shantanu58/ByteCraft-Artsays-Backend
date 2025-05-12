const sendEmailOTP  = require('../emailService');
const User =require('../../../Models/usermode')

const createotp =async (req, res) => {
  try {
    const { email } = req.body;
    

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 
    

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    await user.save();
    
    try {

      await sendEmailOTP(email, otp);
      
      return res.json({ 
        success: true,
        message: 'OTP sent successfully',
        via: 'email',
        debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (sendError) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpiry = undefined;
      await user.save();
      
      console.error('Failed to send OTP:', sendError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP via email',
        error: sendError.message
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message
    });
  }
};

module.exports=createotp ;
// const sendEmailOTP = require('../emailService');
// const sendSMS = require('../smsService');
// const User = require('../../../Models/usermode');

// const createotp = async (req, res) => {
//   try {
//     const { emailOrPhone } = req.body;

//     if (!emailOrPhone) {
//       return res.status(400).json({ message: 'Email or phone number is required' });
//     }

//     const isEmail = emailOrPhone.includes('@');
//     const isPhone = /^[0-9]{10,15}$/.test(emailOrPhone); // More flexible phone number validation

//     if (!isEmail && !isPhone) {
//       return res.status(400).json({
//         message: 'Please enter a valid email or phone number (10-15 digits)',
//       });
//     }

//     const user = await User.findOne({
//       $or: [
//         { email: isEmail ? emailOrPhone : null },
//         { phone: isPhone ? emailOrPhone : null },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: 'User not found with this email/phone',
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     user.resetPasswordOtp = otp;
//     user.resetPasswordOtpExpiry = otpExpiry;
//     await user.save();

//     try {
//       if (isEmail) {
//         await sendEmailOTP(emailOrPhone, otp);
//       } else {
//         // Format phone number for SMS
//         let formattedPhone = emailOrPhone;
//         // If it's a 10-digit number (Indian), prepend +91
//         if (/^[0-9]{10}$/.test(formattedPhone)) {
//           formattedPhone = `+91${formattedPhone}`;
//         }
//         await sendSMS(formattedPhone, otp);
//       }

//       return res.json({
//         success: true,
//         message: 'OTP sent successfully',
//         via: isEmail ? 'email' : 'sms',
//         debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
//       });
//     } catch (sendError) {
//       // Clear OTP if sending fails
//       user.resetPasswordOtp = undefined;
//       user.resetPasswordOtpExpiry = undefined;
//       await user.save();

//       console.error('Failed to send OTP:', sendError.message);
//       return res.status(500).json({
//         success: false,
//         message: `Failed to send OTP via ${isEmail ? 'email' : 'sms'}`,
//         error: process.env.NODE_ENV === 'development'
//           ? sendError.message
//           : 'Internal error while sending OTP',
//       });
//     }
//   } catch (error) {
//     console.error('Forgot password error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to process forgot password request',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };

// module.exports = createotp;

// const sendEmailOTP = require('../emailService');
// const sendSMS = require('../smsService');
// const User = require('../../../Models/usermode');

// const createotp = async (req, res) => {
//   try {
//     const { emailOrPhone } = req.body;

//     if (!emailOrPhone) {
//       return res.status(400).json({ message: 'Email or phone number is required' });
//     }

//     const isEmail = emailOrPhone.includes('@');
//     const isPhone = /^[0-9]{10}$/.test(emailOrPhone);

//     if (!isEmail && !isPhone) {
//       return res.status(400).json({
//         message: 'Please enter a valid email or 10-digit phone number',
//       });
//     }

//     const user = await User.findOne({
//       $or: [
//         { email: isEmail ? emailOrPhone : null },
//         { phone: isPhone ? emailOrPhone : null },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: 'User not found with this email/phone',
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     user.resetPasswordOtp = otp;
//     user.resetPasswordOtpExpiry = otpExpiry;
//     await user.save();

//     try {
//       if (isEmail) {
//         await sendEmailOTP(emailOrPhone, otp);
//       } else {
//         // Format phone number for SMS (add country code)
//         let formattedPhone = emailOrPhone;
//         if (/^[0-9]{10}$/.test(formattedPhone)) {
//           formattedPhone = `91${formattedPhone}`; // MSG91 expects 91 prefix without +
//         }
//         await sendSMS(formattedPhone, otp);
//       }

//       return res.json({
//         success: true,
//         message: 'OTP sent successfully',
//         via: isEmail ? 'email' : 'sms',
//         debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
//       });
//     } catch (sendError) {
//       user.resetPasswordOtp = undefined;
//       user.resetPasswordOtpExpiry = undefined;
//       await user.save();

//       console.error('Failed to send OTP:', sendError.message);
//       return res.status(500).json({
//         success: false,
//         message: `Failed to send OTP via ${isEmail ? 'email' : 'sms'}`,
//         error: process.env.NODE_ENV === 'development'
//           ? sendError.message
//           : 'Internal error while sending OTP',
//       });
//     }
//   } catch (error) {
//     console.error('Forgot password error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to process forgot password request',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };

// module.exports = createotp;

