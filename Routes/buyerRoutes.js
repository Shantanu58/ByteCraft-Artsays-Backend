const express = require('express');
const {

  getBuyer,
  updateBuyer,
  deleteBuyer,

  getAllBuyers,
} = require('../controllers/BuyerController');

const router = express.Router();

// Routes for buyer management

router.get('/get-buyer/:userId', getBuyer); 
router.get('/get-Allbuyer', getAllBuyers);


router.put('/update-buyer/:userId', updateBuyer); 
router.delete('/Delete-buyer/:userId', deleteBuyer); 

module.exports = router;
