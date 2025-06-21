const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middlewares/authMiddleware");
const {
    getallresellproductbybuyerid,
    getpurchasedproductbyid,
    getbuyertransaction
   
  
 } = require("../controllers/Resellproduct/index");

 router.get("/getallresellproduct/:buyerId",authMiddleware,getallresellproductbybuyerid);
 router.get("/getallpurchasedproduct/:buyerId",getpurchasedproductbyid);
 router.get("/getallresellproducttransaction/:buyerId",authMiddleware,getbuyertransaction);
module.exports = router;
