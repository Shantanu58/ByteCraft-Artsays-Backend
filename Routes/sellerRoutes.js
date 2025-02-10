const express = require('express');
const {
  getallseller,
  deleteseller
} = require('../controllers/Seller/index');

const router = express.Router();

router.get('/get-Allsellers', getallseller);
router.delete('/Delete-seller/:userId', deleteseller);

module.exports = router;
