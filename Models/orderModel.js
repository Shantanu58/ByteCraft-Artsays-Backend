const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    art_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Art', required: true },
    amount: { type: Number, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
