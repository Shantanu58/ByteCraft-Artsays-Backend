const express = require("express");
const router = express.Router();
// const upload = require("../Middlewares/Multerfile/images"); 
const authMiddleware = require("../Middlewares/authMiddleware");
const {
     updateproductstatus,
     deleteproduct,
     fetchbyid,          
     statusapprovedproduct,
     getProductbyartistid,
     gettranscation
 } = require("../controllers/Artist/index");



router.put("/updateproductstatus/:id", authMiddleware,updateproductstatus);
router.delete("/deleteproduct/:id", authMiddleware,deleteproduct);
router.get("/getproduct/:id",fetchbyid);
router.get("/getstatusapprovedproduct", authMiddleware,statusapprovedproduct);
router.get("/getproductbyartist/:userId", authMiddleware,getProductbyartistid);
router.get("/gettransactionartist",gettranscation);

module.exports = router;