const express = require('express');
const {

  getBuyer,
  updateBuyer,
  deleteBuyer,

  getAllBuyers,
} = require('../controllers/BuyerController');

const router = express.Router();

// Routes for buyer management

router.get('/get-buyer/:userId', getBuyer); // Get buyer details by user ID
router.get('/get-Allbuyer', getAllBuyers); // Get buyer details by user ID


router.put('/update-buyer/:userId', updateBuyer); // Update buyer details
router.delete('/Delete-buyer/:userId', deleteBuyer); // Delete buyer

module.exports = router;
