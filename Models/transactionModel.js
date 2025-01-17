const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    art_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Art', required: true },
    amount: { type: Number, required: true },
    mode_of_payment: { type: String, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
