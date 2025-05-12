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
     gettranscation,
     packageingmaterialproduct,
     getallartistbuyerprodyctdetails,
     getartistproductbyid,
     getartistsoldproductbyid
 } = require("../controllers/Artist/index");



router.put("/updateproductstatus/:id", authMiddleware,updateproductstatus);
router.delete("/deleteproduct/:id", authMiddleware,deleteproduct);
router.get("/getproduct/:id",fetchbyid);
router.get("/getstatusapprovedproduct", authMiddleware,statusapprovedproduct);
router.get("/getproductbyartist/:userId",getProductbyartistid);
router.get("/gettransactionartist",gettranscation);
router.get("/getpackagingmaterialproductartist",packageingmaterialproduct);

router.get("/getallartistbuyerprodyctdetailsbyid/:userIdOrCropId",getallartistbuyerprodyctdetails);
router.get("/getartistproductbyid/:artistId",getartistproductbyid);
router.get("/getartistsoldproductbyid/:userId",getartistsoldproductbyid)

module.exports = router;