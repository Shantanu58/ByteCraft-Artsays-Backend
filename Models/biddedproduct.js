const mongoose = require('mongoose');

const biddedSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bidding',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    biddedDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery'],
      required: true,
    },
  },
  { timestamps: true }
);


function generateTransactionId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let id = '';


  const letterCount = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < letterCount; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }

 
  for (let i = id.length; i < 12; i++) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return id;
}


biddedSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = generateTransactionId();
  }
  next();
});

module.exports = mongoose.model('Biddedproduct', biddedSchema);
