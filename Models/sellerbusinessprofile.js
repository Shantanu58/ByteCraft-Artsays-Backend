const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true, trim: true },
    businessDescription: { type: String,trim: true },
    website: { type: String, trim: true },
}, { timestamps: true });

const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);
module.exports = BusinessProfile;