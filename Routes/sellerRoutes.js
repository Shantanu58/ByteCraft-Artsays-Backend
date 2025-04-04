const express = require('express');
const {
  getallseller,
  deleteseller,
  getsellerproduct,
  sellersoldproduct,
  gettransaction,
  packageingmaterialproductseller,
  getsellerproductbyid,
  getsoldproductbyid
} = require('../controllers/Seller/index');

const router = express.Router();

router.get('/get-Allsellers', getallseller);
router.delete('/Delete-seller/:userId', deleteseller);
router.get("/getsellerproduct",getsellerproduct);
router.get("/getsellerproductbyid/:userId",getsellerproductbyid);
router.get("/sellersoldproduct",sellersoldproduct);
router.get("/gettransactionseller",gettransaction);
router.get("/getpackagingmaterialproductseller",packageingmaterialproductseller);
router.get("/getsoldproductbyid/:userId",getsoldproductbyid);

module.exports = router;
