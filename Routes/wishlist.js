const express = require('express');
const router = express.Router();
const Buyer = require('../Models/Buyer'); // Adjust path as needed
const Product = require('../Models/Product'); // Assuming Product model exists

// Middleware to find the buyer
router.use(async (req, res, next) => {
  const userId = req.userId; // Ensure this comes from an authentication middleware
  try {
    const buyer = await Buyer.findOne({ user: userId });
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    req.buyer = buyer; // Attach buyer to request object
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch wishlist
router.get('/', async (req, res) => {
  try {
    const buyer = await req.buyer.populate('wishlist').execPopulate();
    res.json(buyer.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

// Add to wishlist
router.post('/', async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const buyer = req.buyer;

    // Add product to wishlist if not already present
    if (!buyer.wishlist.includes(productId)) {
      buyer.wishlist.push(productId);
      await buyer.save();
    }

    res.json(buyer.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
});

// Remove from wishlist
router.delete('/', async (req, res) => {
  const { productId } = req.body;
  try {
    const buyer = req.buyer;

    // Remove product from wishlist
    buyer.wishlist = buyer.wishlist.filter((id) => id.toString() !== productId);
    await buyer.save();

    res.json(buyer.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

module.exports = router;
