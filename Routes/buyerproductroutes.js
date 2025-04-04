const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middlewares/authMiddleware");
const {
    getbuyerproduct,
    updatebuyerproductstatus,
    fetchbuyerrequestbyid,
    createproductpurchased,
    getbuyerpurchasedproduct,
    totalquantityproduct,
    createproductrequest,
    getproductrequest,
    getbuyerproductbyid,
    updtaeproductrequestatus,
    getbuyerpurchaseproductdetails,
    buyersoldproduct,
    gettransaction,
    packageingmaterialproductbuyer,
    gettransactionbybuyerid,
    getbuyerrequestbyid,
    getsoldproductbyid
  
 } = require("../controllers/Buyer/Index");

 router.get("/getbuyerproduct",getbuyerproduct);
 router.put("/updatebuyerproductstatus/:id",updatebuyerproductstatus);
 router.get("/getproductbybuyerid/:userId", authMiddleware,fetchbuyerrequestbyid);
 router.post("/buyerpurchase",createproductpurchased);
 router.get("/getbuyerpurchaseproduct",getbuyerpurchasedproduct);
 router.get("/totalpurchaseproduct",totalquantityproduct);
 router.post("/createproductrequestbuyer",createproductrequest);
 router.get("/getproductrequest",getproductrequest);
 router.get("/getbuyerproductbyid/:userIdOrCropId",getbuyerproductbyid);
 router.put("/updateproductrequeststatus/:id/:type",updtaeproductrequestatus);
 router.get("/getbuyerproductpurchaseddetailsbyid/:id",getbuyerpurchaseproductdetails);
 router.get("/buyersoldproduct",buyersoldproduct);
 router.get("/gettransactionbuyer",gettransaction);
 router.get("/gettransactionbybuyerid/:buyerId",gettransactionbybuyerid);
router.get("/getpackagingmaterialproductbuyer",packageingmaterialproductbuyer);
router.get("/getproductrequestbyid/:buyerId",getbuyerrequestbyid);
router.get("/buyersoldproductbyid/:userId",getsoldproductbyid);
module.exports = router;
