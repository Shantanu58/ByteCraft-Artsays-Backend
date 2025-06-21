const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: Number, unique: true, required: true  }, 
  ifscCode: { type: String, required: true },
  upiId: { type: String, default: '' },
}, { timestamps: true });

const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);
module.exports = BankDetails;
