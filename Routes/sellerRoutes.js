const express = require('express');
const {
  getallseller,
  deleteseller,
  getsellerproduct,
  sellersoldproduct,
  gettransaction
} = require('../controllers/Seller/index');

const router = express.Router();

router.get('/get-Allsellers', getallseller);
router.delete('/Delete-seller/:userId', deleteseller);
router.get("/getsellerproduct",getsellerproduct);
router.get("/sellersoldproduct",sellersoldproduct);
router.get("/gettransactionseller",gettransaction);

module.exports = router;
