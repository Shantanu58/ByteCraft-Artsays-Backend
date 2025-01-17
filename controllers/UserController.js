const express = require('express');
const bcrypt = require('bcrypt');
// const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');
const User = require('../Models/usermode');

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

// Login User
const loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({ email: emailOrPhone }) || await User.findOne({ phone: emailOrPhone });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role,userType : user.userType }, process.env.JWT_SECRET, { expiresIn: '7d' });
console.log(user.role)
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User by ID
const getUser = async (req, res) => {
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
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirm password do not match" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password and update the user document
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ message: "Error changing password", error: error.message });
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




};
