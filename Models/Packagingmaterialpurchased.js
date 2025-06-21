const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PackagingMaterial',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    purchaseDate: {
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


purchaseSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = generateTransactionId();
  }
  next();
});

module.exports = mongoose.model('BuyerPackagingproductPurchase', purchaseSchema);
