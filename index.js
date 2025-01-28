require('dotenv').config(); // Load environment variables
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require('path');
const User = require("./Models/usermode"); // Assuming this is your User model
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    try {
      // Manage indexes if necessary
      const indexes = await User.collection.indexes();
      console.log("Indexes before deletion:", indexes);

      if (indexes.some(index => index.name === 'phone_1')) {
        await User.collection.dropIndex('phone_1');
        console.log("'phone_1' index dropped");
      }
      if (indexes.some(index => index.name === 'email_1')) {
        await User.collection.dropIndex('email_1');
        console.log("'email_1' index dropped");
      }
    } catch (err) {
      console.error("Error during index operations:", err);
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Import routes
require('./routes')(app);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
