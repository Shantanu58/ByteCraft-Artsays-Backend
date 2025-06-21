const express = require('express');
const router = express.Router();
const Order = require('../Models/orderModel'); // Adjust the path if necessary
const User = require('../Models/usermode'); // Ensure you import User model for validation

// POST request to create a new order
router.post('/create-order', async (req, res) => {
    const { user_id, art_id, amount } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new order
        const newOrder = new Order({
            user_id,
            art_id,
            amount
        });

        await newOrder.save();

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating order" });
    }
});

module.exports = router;
