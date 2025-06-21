const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../Models/usermode");

const loginUser = async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
  
      if (!emailOrPhone || !password) {
        return res
          .status(400)
          .json({ message: "Email/Phone and password are required" });
      }
  
      let formattedPhone = emailOrPhone;
      if (/^\d{10}$/.test(emailOrPhone)) {
        formattedPhone = `+91${emailOrPhone}`;
      }
  
      let user = await User.findOne({ email: emailOrPhone });
  
      if (!user) {
        user = await User.findOne({
          $or: [{ phone: emailOrPhone }, { phone: formattedPhone }],
        });
      }
  
      if (!user) {
        return res.status(404).json({
          message: "User not found. Please check your email or phone number.",
        });
      }
  
      if (!user.password) {
        return res
          .status(500)
          .json({ message: "User password is missing. Contact support." });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Incorrect password. Please try again." });
      }
   console.log("JWT_EXPIRATION from .env:", process.env.JWT_EXPIRATION);
      const token = jwt.sign(
        { userId: user._id, role: user.role, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION  }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        userType: user.userType,
        email: user.email,
        phone: user.phone,
        userId:user._id,
        status:user.status
      });
    } catch (error) {
      console.error("Error during login:", error);
      res
        .status(500)
        .json({ message: "Internal server error.", error: error.message });
    }
  };

module.exports = loginUser