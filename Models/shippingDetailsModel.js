// Models/shippingDetailsModel.js
const mongoose = require('mongoose');

const shippingDetailsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true }, // Reference to address
    shop_address: { type: String, required: true }, // Shop address, replace with actual shop address as needed
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const ShippingDetails = mongoose.model('ShippingDetails', shippingDetailsSchema);

module.exports = ShippingDetails;
