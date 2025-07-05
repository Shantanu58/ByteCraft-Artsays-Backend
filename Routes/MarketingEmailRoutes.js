const express = require("express");
const sendMarketingEmail = require("../controllers/marketingEmailController");
const { emailAttachmentsUpload } = require("../Middlewares/Multerfile/emailUploadMiddleware");
 
const router = express.Router();

router.post("/send-email", emailAttachmentsUpload, sendMarketingEmail);
 
module.exports = router;