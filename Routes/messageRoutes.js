const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesByConversationId,
} = require("../controllers/messageController");

router.post("/", sendMessage);
router.get("/:conversationId", getMessagesByConversationId);

module.exports = router;
