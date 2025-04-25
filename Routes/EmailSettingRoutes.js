// routes/blogRoutes.js
const express = require("express");
const {
  saveOrUpdateEmailSettings,
  getEmailSettings,
  sendTestEmail,
} = require("../controllers/EmailSetting/index");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/save-email-settings", authMiddleware, saveOrUpdateEmailSettings);
router.get("/get-email-settings", authMiddleware, getEmailSettings);
router.post("/send-test-email", authMiddleware, sendTestEmail);

module.exports = router;
