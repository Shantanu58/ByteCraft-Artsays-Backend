const express = require('express');
const bcrypt = require('bcrypt');
// const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');
const User = require('../Models/usermode');
const BusinessProfile = require("../models/sellerbusinessprofile");
const ArtistDetails = require('../models/artistdetails');

// Register User
const registerUser = async (req, res) => {
  const { name, lastName, email, phone, password, userType } = req.body;

  const emailValue = email !== 'null' ? email : null;
  const phoneValue = phone !== 'null' ? phone : null;

  const query = {};
  if (emailValue) query.email = emailValue;
  if (phoneValue) query.phone = phoneValue;

  const existingUser = await User.findOne(query);
  if (existingUser) {
    return res.status(400).json({ message: "Email or Phone already exists." });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    lastName,
    email: emailValue,
    phone: phoneValue,
    password: hashedPassword,
    userType,
    role: userType.toLowerCase(),
  });

  try {
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};


const loginUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Email/Phone and password are required' });
    }

    let formattedPhone = emailOrPhone;
    if (/^\d{10}$/.test(emailOrPhone)) {
      formattedPhone = `+91${emailOrPhone}`;
    }

    let user = await User.findOne({ email: emailOrPhone });

    if (!user) {
      user = await User.findOne({
        $or: [{ phone: emailOrPhone }, { phone: formattedPhone }]
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your email or phone number.' });
    }

    if (!user.password) {
      return res.status(500).json({ message: 'User password is missing. Contact support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userType: user.userType,
      email: user.email,
      phone: user.phone
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};







const getUserbypassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
    // console.log("Data sent to frontend (getUser):", user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Get User by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
    // console.log("Data sent to frontend (getUser):", user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Welcome Message by Email
const showWelcomeMessage = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).select('firstName lastName');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const message = `Welcome back, ${user.firstName} ${user.lastName}!`;
    res.json({ message });
  } catch (error) {
    console.error('Error fetching user for welcome message:', error.message);
    res.status(500).json({ message: 'Error fetching user for welcome message', error: error.message });
  }
};

// Get User by Email
const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('firstName lastName');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if file exists in request and update profilePhoto path
  if (req.file) {
    updateData.profilePhoto = `/uploads/profile_photos/${req.file.filename}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

  // Change Password
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword, email, phoneNumber, username } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.userId !== user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own information" });
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








const allowedUserTypes = ["Artist", "Buyer", "Seller", "Super-Admin"];

const createuser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, userType, businessName, artistName } = req.body;

   
    if (!firstName || !lastName || !password || !confirmPassword || !userType) {
      return res.status(400).json({ message: "All required fields are missing" });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: "Either email or phone number is required" });
    }

    if (!allowedUserTypes.includes(userType)) {
      return res.status(400).json({ 
        message: "Invalid userType. Must be 'Artist', 'Buyer', 'Seller', or 'Super-Admin'." 
      });
    }

    
    const roleSpecificRequirements = {
      Seller: () => !businessName && "Business name is required for sellers",
      Artist: () => !artistName && "Artist name is required for artists"
    };

    const errorMessage = roleSpecificRequirements[userType]?.();
    if (errorMessage) return res.status(400).json({ message: errorMessage });

   
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }

    
    if (phone) {
    
      const cleanPhone = phone.replace(/^\+91/, '');
      if (cleanPhone.length !== 10 || !/^[0-9]{10}$/.test(cleanPhone)) {
        return res.status(400).json({ message: "Phone number must be 10 digits" });
      }
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }


    const existingUser = await User.findOne({ 
      $or: [
        ...(email ? [{ email }] : []), 
        ...(phone ? [{ phone: `+91${String(phone).replace(/^\+91/, '')}` }] : []) 
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email or phone number is already registered" });
      }
      if (existingUser.phone === `+91${phone.replace(/^\+91/, '')}`) {
        return res.status(400).json({ message: "Email or Phone number is already registered" });
      }
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: firstName,
      lastName,
      email: email || undefined,
      phone: phone ? `+91${phone.replace(/^\+91/, '')}` : undefined,
      password: hashedPassword,
      userType,
      role: userType.toLowerCase(),
    });

    await newUser.save();

  
    if (userType === "Seller") {
      const newBusinessProfile = new BusinessProfile({
        userId: newUser._id,
        businessName,
      });
      await newBusinessProfile.save();
      newUser.businessProfile = newBusinessProfile._id;
    }
    else if (userType === "Artist") {
      const newArtistDetails = new ArtistDetails({
        userId: newUser._id,
        artistName,
      });
      await newArtistDetails.save();
      newUser.artistDetails = newArtistDetails._id;
    }

    await newUser.save();

    res.status(201).json({ 
      success: true,
      message: `${userType} account created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.userType,
        role: newUser.role,
        ...(userType === "Seller" && { businessProfile: newUser.businessProfile }),
        ...(userType === "Artist" && { artistDetails: newUser.artistDetails })
      }
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};





module.exports = {
  registerUser,
  loginUser,
  getUser,
  showWelcomeMessage,
  getUserByEmail,
  updateUserProfile,
  changePassword,
  getUserbypassword,
  createuser

};
