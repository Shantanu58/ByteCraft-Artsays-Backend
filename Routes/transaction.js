const express = require('express');
const {
 getalltransaction,
 getalltransactionbyartistid,
 getalltransactionbysellerid
} = require('../controllers/Transaction/index');

const router = express.Router();

router.get('/get-alltransaction', getalltransaction);
router.get('/get-alltransactionbyartistid/:artistId', getalltransactionbyartistid);
router.get('/get-alltransactionbysellerid/:sellerId',getalltransactionbysellerid);

module.exports = router;
