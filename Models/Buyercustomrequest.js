const mongoose = require("mongoose");

const BuyerRequestSchema = new mongoose.Schema(
  {
    ProductName: { type: String, required: true },
    Description: { type: String, required: true },
    BuyerImage: { type: String, required: true },
    Buyer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    Budget: { type: Number, required: true },
    Artist: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    },
    RequestStatus: {
      type: String,
      enum: ['Approved', 'Rejected', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuyerRequest", BuyerRequestSchema);
