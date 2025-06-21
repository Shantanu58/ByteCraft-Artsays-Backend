const mongoose = require('mongoose');

const BiddingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    startingBid: {
      type: Number,
      required: true,
    },
    currentBid: {
      type: Number,
      default: null, 
    },
    endBid: {
      type: Number,
      default: null, 
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Ended'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);


BiddingSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Active' && this.currentBid === null) {
      this.currentBid = this.startingBid; 
    }
    if (this.status === 'Ended' && this.endBid === null) {
      this.endBid = this.currentBid; 
    }
  }
  next();
});

module.exports = mongoose.model('Bidding', BiddingSchema);
