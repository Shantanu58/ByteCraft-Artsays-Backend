const mongoose = require('mongoose');

const packagingMaterialSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: [true, 'User ID is required'],
      ref: 'User' 
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
          values: ['Web Design', 'Photography', 'Technology', 'Lifestyle', 'Sports'],
          message: 'Invalid product category'
        }
      },
    mainImage: {
      type: String,
      required: true,
    },
    otherImages: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

packagingMaterialSchema.index({ createdAt: 1 });

module.exports = mongoose.model('PackagingMaterial', packagingMaterialSchema);