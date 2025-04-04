const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    minArtworkPrice: {
        type: Number,
        required: true
    },
    customOrders: {
        type: Boolean,
        default: false
    },
    commissionTerms: {
        type: [String],
        default: []
    },
    preferredPaymentMethod: {
        type: [String],
        default: []
    },
    sampleArtwork: {
        type: String, 
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);