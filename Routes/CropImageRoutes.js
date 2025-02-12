const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/Multerfile/images"); 
const authMiddleware = require("../Middlewares/authMiddleware");
const {
      cropImage,
      getImage
 } = require("../controllers/CropImage/index");



router.post("/cropImage", upload, cropImage);
router.get("/get-cropImage",getImage)

module.exports = router;
