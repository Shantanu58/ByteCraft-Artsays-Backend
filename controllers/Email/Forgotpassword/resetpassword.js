const bcrypt = require('bcrypt');
const User = require('../../../Models/usermode');

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

 
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry || user.resetPasswordOtp !== otp || user.resetPasswordOtpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    


    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    console.log('Password Updated Successfully for:', email); 

    return res.json({ success: true, message: 'Password reset successfully' });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
};

module.exports = resetPassword;

// const bcrypt = require('bcrypt');
// const User = require('../../../Models/usermode');

// const resetPassword = async (req, res) => {
//   try {
//     const { emailOrPhone, otp, newPassword } = req.body;

//     if (!emailOrPhone || !otp || !newPassword) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
//     }

//     const user = await User.findOne({
//       $or: [
//         { email: emailOrPhone.includes('@') ? emailOrPhone : undefined },
//         { phone: /^[0-9]{10}$/.test(emailOrPhone) ? emailOrPhone : undefined }
//       ]
//     });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Convert OTPs to strings to avoid type mismatch
//     if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry || 
//         user.resetPasswordOtp.toString() !== otp.toString() || 
//         new Date(user.resetPasswordOtpExpiry) < new Date()) {
//       return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     console.log('Hashed Password:', hashedPassword);

//     user.password = hashedPassword;
//     user.resetPasswordOtp = undefined;
//     user.resetPasswordOtpExpiry = undefined;

//     try {
//       await user.save();
//     } catch (err) {
//       console.error('Error saving user:', err);
//       return res.status(500).json({ success: false, message: 'Database error' });
//     }

//     console.log('Password Updated Successfully for:', emailOrPhone);
//     return res.json({ success: true, message: 'Password reset successfully' });

//   } catch (error) {
//     console.error('Password reset error:', error);
//     return res.status(500).json({ 
//       success: false, 
//       message: 'Failed to reset password', 
//       error: error.message 
//     });
//   }
// };

// module.exports = resetPassword;

