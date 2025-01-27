const User = require('../Models/usermode');
const bcrypt = require('bcrypt');
const userAgent = require('user-agent');
const requestIp = require('request-ip');

// Function to authenticate user
async function authenticateUser(emailOrPhone, password) {
    if (!emailOrPhone) {
      throw new Error('Email or Phone is required');
    }
  
    // Check if it's an email or phone number
    let query;
    if (emailOrPhone.includes('@')) {
      query = { email: emailOrPhone.toLowerCase() };
    } else {
      query = { phone: emailOrPhone };
    }
  
    const user = await User.findOne(query);
  
    if (!user) {
      throw new Error('Invalid credentials');
    }
  
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (isMatch) {
      return user;
    } else {
      throw new Error('Invalid credentials');
    }
  }
  
  

// Handle login and store device/browser info
async function handleLogin(req, res) {
    console.log('Request body:', req.body); // Add this line to log the incoming request
    
    const ipAddress = requestIp.getClientIp(req); // Get the client's IP address
    const deviceInfo = userAgent.parse(req.headers['user-agent']); // Parse user agent to get device info
    
    const loginData = {
      device: deviceInfo.device ? deviceInfo.device.family : 'Unknown', // Fallback to 'Unknown' if device info is missing
      browser: deviceInfo.family || 'Unknown', // Fallback to 'Unknown' if browser family is missing
      ipAddress: ipAddress,
      loginTime: new Date(),
    };
  
    try {
      // Authenticate user
      const user = await authenticateUser(req.body.email, req.body.password);
  
      console.log('User authenticated:', user.email);
      console.log('Login data:', loginData);
  
      // Push login details to the loginHistory array
      user.loginHistory.push(loginData);
      await user.save(); // Save user with new login history
  
      res.status(200).json({
        message: 'Login successful',
        user: {
          email: user.email,
          userType: user.userType,
          loginHistory: user.loginHistory, // Optional: Include login history if you want to send it back
        }
      });
    } catch (error) {
      // Log error for debugging
      console.error('Error during login:', error.message);
      res.status(400).json({ message: 'Invalid credentials', error: error.message });
    }
  }
  

module.exports = { handleLogin };
