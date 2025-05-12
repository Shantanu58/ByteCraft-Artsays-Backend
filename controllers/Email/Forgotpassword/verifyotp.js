const User =require('../../../Models/usermode')
const verifyotp= async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({ 
          success: false,
          message: 'Email and OTP are required' 
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }
  
  
      if (user.resetPasswordOtp !== otp) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid OTP' 
        });
      }
  
      if (user.resetPasswordOtpExpiry < new Date()) {
        return res.status(400).json({ 
          success: false,
          message: 'OTP has expired' 
        });
      }
  
      // OTP is valid
      return res.json({ 
        success: true,
        message: 'OTP verified successfully'
      });
  
    } catch (error) {
      console.error('OTP verification error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to verify OTP',
        error: error.message
      });
    }
  };

  module.exports=verifyotp;

// const User = require('../../../Models/usermode');

// const verifyotp = async (req, res) => {
//   try {
//     const { emailOrPhone, otp } = req.body;

//     if (!emailOrPhone || !otp) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Email/Phone and OTP are required' 
//       });
//     }

 
//     const user = await User.findOne({
//       $or: [
//         { email: emailOrPhone.includes('@') ? emailOrPhone : null },
//         { phone: /^[0-9]{10}$/.test(emailOrPhone) ? emailOrPhone : null }
//       ]
//     });

//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'User not found' 
//       });
//     }

//     if (user.resetPasswordOtp !== otp) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Invalid OTP' 
//       });
//     }

//     if (user.resetPasswordOtpExpiry < new Date()) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'OTP has expired' 
//       });
//     }

 
//     return res.json({ 
//       success: true,
//       message: 'OTP verified successfully'
//     });

//   } catch (error) {
//     console.error('OTP verification error:', error);
//     return res.status(500).json({ 
//       success: false,
//       message: 'Failed to verify OTP',
//       error: error.message
//     });
//   }
// };

// module.exports = verifyotp;