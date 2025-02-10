const express = require("express");
const router = express.Router();
const { upload, handleBase64Images }= require("../Middlewares/Multerfile/images"); 
const authMiddleware = require("../Middlewares/authMiddleware");
const {
      cropImage,
      getImage
 } = require("../controllers/CropImage/index");



router.post("/cropImage", upload,handleBase64Images, cropImage);
router.get("/get-cropImage",getImage)

module.exports = router;
