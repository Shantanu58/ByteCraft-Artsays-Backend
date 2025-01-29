const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transactionModel'); // Adjust the path if necessary
const User = require('../Models/usermode'); // Ensure you import User model for validation

const mongoose = require('mongoose');

// POST request to create a new transaction
 
    const TranctionsController =async (req, res) => {
    const { user_id, order_id, art_id, amount, mode_of_payment, status } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate ObjectId
        if (!mongoose.isValidObjectId(order_id) || !mongoose.isValidObjectId(art_id)) {
            return res.status(400).json({ message: "Invalid order_id or art_id" });
        }

        // Convert order_id and art_id to ObjectId
        const orderId = new mongoose.Types.ObjectId(order_id);
        const artId = new mongoose.Types.ObjectId(art_id);

        // Create a new transaction
        const newTransaction = new Transaction({
            user_id,
            order_id: orderId,
            art_id: artId,
            amount,
            mode_of_payment,
            status
        });

        await newTransaction.save();

        // Push the transaction ID into the user's transactions array
        user.transactions.push(newTransaction._id);
        await user.save();

        res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating transaction", error: error.message });
    }
};



module.exports = {TranctionsController}
