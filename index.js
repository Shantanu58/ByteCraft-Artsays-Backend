// require('dotenv').config(); // Load environment variables
// const mongoose = require("mongoose");
// const express = require("express");
// const cors = require("cors");
// const path = require('path');
// const User = require("./Models/usermode"); // Assuming this is your User model
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => {
//     console.log('MongoDB connected');
//     try {
//       // Manage indexes if necessary
//       const indexes = await User.collection.indexes();
//       console.log("Indexes before deletion:", indexes);

//       if (indexes.some(index => index.name === 'phone_1')) {
//         await User.collection.dropIndex('phone_1');
//         console.log("'phone_1' index dropped");
//       }
//       if (indexes.some(index => index.name === 'email_1')) {
//         await User.collection.dropIndex('email_1');
//         console.log("'email_1' index dropped");
//       }
//     } catch (err) {
//       console.error("Error during index operations:", err);
//     }
//   })
//   .catch(err => console.log('MongoDB connection error:', err));

// // Import routes
// require('./routes')(app);


// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config(); // Load environment variables
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require('path');
const User = require("./Models/usermode"); // Assuming this is your User model
const Conversation = require("./Models/Conversations.js");
const Messages = require("./Models/Messages.js");

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

// Conversation Routes
app.post('/api/conversation', async (req, res) => {
  try {
    const { senderId, reciverId } = req.body;
    const newConversation = new Conversation({ members: [senderId, reciverId] });
    await newConversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log("Error in creating conversation:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/api/conversation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({ members: { $in: [userId] } });

    const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
      const reciverId = conversation.members.find((member) => member !== userId);
      const user = await User.findById(reciverId);
      return {
        user: { email: user.email, name: user.name },
        conversationId: conversation._id
      };
    }));

    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log("Error retrieving conversation:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Message Routes
app.post('/api/message', async (req, res) => {
  try {
    const { conversationId, senderId, message } = req.body;
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log("Error in sending message:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/api/message/:conversationId', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Messages.find({ conversationId });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error retrieving messages:", error);
    res.status(500).send("Internal Server Error");
  }
});

require('./routes')(app);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

