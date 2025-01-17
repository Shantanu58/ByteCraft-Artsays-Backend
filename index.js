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

// Import routes
const userRoute = require ('./Routes/User.js')

// const loginRoute = require('./Routes/login');
const refreshTokenRoute = require('./Routes/refreshtokens');
// const registerRoute = require('./Routes/register');
const addressRoute = require('./Routes/useradress'); // Import address route

const transactionRoute = require('./Routes/transactionRoutes'); // Import transaction route
const orderRoute = require('./Routes/orderRoutes'); // Import order route
const shippingRoute = require('./Routes/shippingRoutes'); // Import shipping route
const socialBlogRoute = require('./Routes/socialBlogRoutes');
const requestedArtsRoutes = require('./Routes/requestedArtsRoutes');
const artistRoutes = require('./Routes/artistRoutes.js'); // Import artist routes
const ProductRout=require('./Routes/ProductRout.js')
const buyerRoutes = require('./Routes/buyerRoutes');
const cartRoutes = require('./Routes/cartRoutes.js');
const wishlistRoutes = require('./Routes/wishlist.js');
const blogPostRoutes =require('./Routes/BlogpostRoutes.js')
const conversationRoutes = require("./Routes/conversationRoutes.js");
const messageRoutes = require("./Routes/messageRoutes.js");


// Use routes
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);


app.use("/Blog-Post",blogPostRoutes)
app.use('/auth', userRoute);
app.use('/refresh-token', refreshTokenRoute);

app.use('/user-address', addressRoute);
app.use('/transactions', transactionRoute); // Use the transaction routes
app.use('/orders', orderRoute); // Use the order route
app.use('/shipping', shippingRoute); // Use the shipping route
app.use('/social', socialBlogRoute);
app.use('/api/requested-arts', requestedArtsRoutes);
app.use('/artist', artistRoutes);
app.use('/product-management',ProductRout );
app.use('/uploads', express.static('uploads'));
app.use('/api/buyers', buyerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    try {
      // List existing indexes and delete 'phone_1' index if it exists
      const indexes = await User.collection.indexes();
      console.log("Indexes before deletion:", indexes);

      // Check if 'phone_1' exists and delete it
      const hasPhoneIndex = indexes.some(index => index.name === 'phone_1');
      if (hasPhoneIndex) {
        const result = await User.collection.dropIndex('phone_1');
        console.log("'phone_1' index dropped:", result);
      } else {
        console.log("'phone_1' index does not exist.");
      }
    } catch (err) {
      console.error("Error during index operations:", err);
    }

    try {
      // List existing indexes and delete 'email_1' index if it exists
      const indexes = await User.collection.indexes();
      console.log("Indexes before deletion:", indexes);

      // Check if 'email_1' exists and delete it
      const hasEmailIndex = indexes.some(index => index.name === 'email_1');
      if (hasEmailIndex) {
        const result = await User.collection.dropIndex('email_1');
        console.log("'email_1' index dropped:", result);
      } else {
        console.log("'email_1' index does not exist.");
      }
    } catch (err) {
      console.error("Error during index operations:", err);
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

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


  // POST route to send a message
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

// GET route to retrieve messages by conversationId
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



  // app.post('api/message',async(req,res)=>{
  //   try {
  //     const {conversationId,senderId,message}=req.body
  //     const newMessage= new Messages({conversationId,senderId,message});
  //     await newMessage.save();
  //     req.status(200).send("Message sent successfully")
  //   } catch (error) {
  //     console.log("error conversation");
      
  //   }
  // })

  // app.post('api/message/:conversationId',async(req,res)=>{
  //   try {
  //     const conversationId=req.params.conversationId;
  //     const messages=await Messages.find({conversationId})
  //   } catch (error) {
  //     console.log("message error");
  //   }
  // })

// Start server
const PORT = process.env.PORT || 3001;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

