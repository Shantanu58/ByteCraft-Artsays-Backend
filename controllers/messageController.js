const Messages = require("../Models/Messages.js");

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, message } = req.body;
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log("Error in sending message:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getMessagesByConversationId = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Messages.find({ conversationId });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error retrieving messages:", error);
    res.status(500).send("Internal Server Error");
  }
};
