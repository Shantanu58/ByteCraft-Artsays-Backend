const express = require("express");
const router = express.Router();
// const upload = require("../Middlewares/Multerfile/images"); 
// const authMiddleware = require("../Middlewares/authMiddleware");
const {
   createbid,
   updatecurrentbid,
   getallbid,
   getallstatusactive,
   createbiddedproduct,
   getBiddedProducts,
   getbiddedproductbybuyerid
     
 } = require("../controllers/Bidding/index");


router.post("/createbid",createbid)
router.put("/updatecurrentbid/:bidId",updatecurrentbid)
router.get("/getallbid",getallbid)
router.get("/getallbidstatusactive",getallstatusactive)

router.post("/createbiddedproduct",createbiddedproduct)
router.get("/getbiddedproduct",getBiddedProducts)
router.get("/getbiddedproductbybuyerid/:buyerId",getbiddedproductbybuyerid)


module.exports = router;
