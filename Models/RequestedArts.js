// Models/RequestedArts.js
const mongoose = require('mongoose');

// Schema for Requested Arts
const requestedArtsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Buyer ID
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Artist ID
  description: { type: String, required: true }, // Description of the requested art
  attributes: { type: String }, // Additional attributes like size, colors, etc.
  askingPrice: { type: Number, required: true }, // Price suggested by the buyer
  discountedPrice: { type: Number }, // Discount offered by the artist
  finalPrice: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(value) {
        return value >= this.discountedPrice; // Ensure final price is >= discounted price
      },
      message: 'Final price must be greater than or equal to the discounted price'
    }
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt timestamps
});

module.exports = mongoose.model('RequestedArts', requestedArtsSchema);
