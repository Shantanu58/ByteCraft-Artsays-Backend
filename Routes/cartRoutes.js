const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const User = require('../Models/usermode');
const authenticateToken = require('../Middlewares/authMiddleware');
 
// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.userID;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
router.post("/addcart/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.userID; // Retrieved from the token
      const productId = req.params.id; // Product ID to add
 
      // Check if the product exists
      const product = await Product.findOne({ productId });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
 
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
 
      // Add product to the cart
      const updatedCart = await user.addcartdata(product._id);
 
      res.status(200).json({ message: "Product added to cart", cart: updatedCart });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
 
router.put('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.userID;
        const { productId, quantity } = req.body;
 
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
 
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.items[productIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// Remove a product from the cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
    try {
        const userId = req.userID;
        const { productId } = req.params;
 
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
 
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
module.exports = router;
 
