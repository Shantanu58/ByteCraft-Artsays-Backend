const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversationsByUserId,
} = require("../controllers/conversationController");

router.post("/", createConversation);
router.get("/:userId", getConversationsByUserId);

module.exports = router;
