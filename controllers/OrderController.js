const Order = require('../Models/orderModel');
const User = require('../Models/usermode');

const createOrder = async (req, res) => {
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

        // Update user model by adding this order to their orders array
        user.orders.push(newOrder._id);
        await user.save();

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating order" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Find user and populate their orders
        const user = await User.findById(user_id).populate('orders');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ orders: user.orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

module.exports = { createOrder, getUserOrders };
