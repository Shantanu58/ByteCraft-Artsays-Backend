// routes/blogRoutes.js
const express = require("express");
const {
  saveOrUpdateEmailSettings,
  getEmailSettings,
  sendTestEmail,
  getAllUserEmails
} = require("../controllers/EmailSetting/index");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/save-email-settings", authMiddleware, saveOrUpdateEmailSettings);
router.get("/get-email-settings", authMiddleware, getEmailSettings);
router.get("/get-allUserMail", getAllUserEmails);
router.post("/send-test-email", authMiddleware, sendTestEmail);

module.exports = router;
