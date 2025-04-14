const bcrypt = require("bcrypt");
const User = require("../../../Models/usermode");

const changePassword = async (req, res) => {
  const { id } = req.params;
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    email,
    phoneNumber,
    username,
  } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.userId !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own information" });
    }

    let updatedPassword = false;
    let updatedAccountData = false;

    if (newPassword || confirmPassword || currentPassword) {
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedNewPassword;
      updatedPassword = true;
    }

    if (username || phoneNumber || email) {
      if (username) {
        const existingUserWithUsername = await User.findOne({ username });
        if (
          existingUserWithUsername &&
          existingUserWithUsername._id.toString() !== user._id.toString()
        ) {
          return res.status(400).json({ message: "Username is already taken" });
        }
        user.username = username;
      }

      if (phoneNumber) {
        const phoneRegex = /^(\+[1-9][0-9]{1,3})?[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({
            message:
              "Invalid phone number format. Must be 10 digits or include a valid country code.",
          });
        }
        user.phone = phoneNumber;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        user.email = email;
      }

      updatedAccountData = true;
    }

    await user.save();

    if (updatedPassword) {
      return res.status(200).json({ message: "Password updated successfully" });
    }

    if (updatedAccountData) {
      return res
        .status(200)
        .json({ message: "Account data updated successfully" });
    }

    res.status(200).json({ message: "No changes were made" });
  } catch (error) {
    console.error("Error updating user information:", error.message);
    res.status(500).json({
      message: "Error updating user information",
      error: error.message,
    });
  }
};

module.exports = changePassword