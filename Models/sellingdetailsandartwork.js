const mongoose = require('mongoose');
const SellDetailsAndArtworkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sampleArtwork: {
        type: String, 
        default: null
    },
    typeOfSeller: {
        type: String
    },
    categoryOfArt: {
        type: [String]
    },
    artStyleSpecialization: {
        type: [String]
    },
    experienceInSellingArt: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SellDetailsAndArtwork', SellDetailsAndArtworkSchema);