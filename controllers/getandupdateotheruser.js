const mongoose = require('mongoose');
const User = require('../Models/usermode');
const bcrypt = require('bcrypt');

const getUserById = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

  
    const user = await User.findById(id)
      .populate('transactions')
      .populate('wishlist')
      .populate('cart.product')
      .populate('orders');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};



const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword, email, phoneNumber, username } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedPassword = false;
    let updatedAccountData = false;

    
    if (newPassword || confirmPassword || currentPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedNewPassword;
      updatedPassword = true;
    }

 
    if (username || phoneNumber || email) {
      if (username) {
        const existingUserWithUsername = await User.findOne({ username });
        if (existingUserWithUsername && existingUserWithUsername._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: "Username is already taken" });
        }
        user.username = username;
      }

      if (phoneNumber) {
        const phoneRegex = /^(\+[1-9][0-9]{1,3})?[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({
            message: "Invalid phone number format. Must be 10 digits or include a valid country code.",
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
      return res.status(200).json({ message: "Account data updated successfully" });
    }

    res.status(200).json({ message: "No changes were made" });
  } catch (error) {
    console.error("Error updating user information:", error.message);
    res.status(500).json({ message: "Error updating user information", error: error.message });
  }
};


  const updateuserprofile = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    if (req.file) {
      updateData.profilePhoto = `/uploads/profile_photos/${req.file.filename}`;
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error.message);
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };

  const deleteUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
     
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
  
  
      const user = await User.findByIdAndDelete(id);
  
    
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  };
  
  



module.exports = { getUserById,changePassword,updateuserprofile,deleteUserById};
