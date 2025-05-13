const Conversation = require("../Models/Conversations.js");
const User = require("../Models/usermode");

exports.createConversation = async (req, res) => {
  try {
    const { senderId, reciverId } = req.body;
    const newConversation = new Conversation({ members: [senderId, reciverId] });
    await newConversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log("Error in creating conversation:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getConversationsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({ members: { $in: [userId] } });

    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const reciverId = conversation.members.find((member) => member !== userId);
        const user = await User.findById(reciverId);
        return {
          user: { email: user.email, name: user.name },
          conversationId: conversation._id,
        };
      })
    );

    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log("Error retrieving conversation:", error);
    res.status(500).send("Internal Server Error");
  }
};
