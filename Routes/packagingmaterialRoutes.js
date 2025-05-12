const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/Multerfile/images"); 
const authMiddleware = require("../Middlewares/authMiddleware");
const {
      addproduct,
      updateproduct,
      getallproduct,
      getproductbyid,
      deleteproduct,
      createpurchase,
      getallpurchased,
      gettransaction,
      getartistpurchasedproductbyid,
      getbuyerpurchasedproductbyid,
      getsellerpurchasedproductbyid,
      getartisttransactionbyid,
      getbuyertransactionbyid,
      getsellertransactionbyid
     
 } = require("../controllers/PackagingMaterial/index");



router.post("/addproduct", upload, addproduct);
router.put("/updateproduct/:id", upload, updateproduct);
router.get("/getallproduct",getallproduct);
router.get("/getproductbyid/:id",getproductbyid);
router.delete("/deleteproductbyid/:id",deleteproduct);



router.post("/createbuyerpurchased", createpurchase);
router.get("/getallpurchased", getallpurchased);
router.get("/getalltransaction",gettransaction);
router.get("/getartist-purchasedproductbyid/:userId", getartistpurchasedproductbyid);
router.get("/getbuyer-purchasedproductbyid/:userId", getbuyerpurchasedproductbyid);
router.get("/getseller-purchasedproductbyid/:userId", getsellerpurchasedproductbyid);

router.get("/getartist-producttransactionbyid/:userId", getartisttransactionbyid);
router.get("/getbuyer-producttransactionbyid/:userId", getbuyertransactionbyid);
router.get("/getseller-producttransactionbyid/:userId", getsellertransactionbyid);



module.exports = router;
