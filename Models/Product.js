const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true }
  },
  productId: { type: String, required: true },
  mainImage: { type: [String], required: true }, // Main image is required
  images: { type: [String], default: [] }, // Optional additional images
  productName: { type: String, required: true },
  newPrice: { type: Number, required: true },
  oldPrice: { type: Number },
  size: { type: String, required: true },
  description: { type: String, required: true },
  numOfPurchases: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
 
