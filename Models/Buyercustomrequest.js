// const mongoose = require("mongoose");

// const BuyerRequestSchema = new mongoose.Schema(
//   {
//     ProductName: { type: String, required: true },
//     Description: { type: String, required: true },
//     BuyerImage: { type: String, required: true },
//     Buyer: {
//       id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     },
//     Budget: { type: Number, required: true },
//     Artist: {
//       id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
//     },
//     RequestStatus: {
//       type: String,
//       enum: ['Approved', 'Rejected', 'Pending'],
//       default: 'Pending',
//     },
//     NegiotaiteBudget:{ type:Number ,required:false},
//     Notes:{type: String ,required:false},
//     updateCount: { type: Number, default: 0 },
//     BuyerNotes:{type: String ,required:false},
//     isUpdated: { type: Boolean, default: false } 
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("BuyerRequest", BuyerRequestSchema);


const mongoose = require("mongoose");

const BuyerRequestSchema = new mongoose.Schema(
  {
    ProductName: { type: String, required: true },
    Description: { type: String, required: true },
    BuyerImage: { type: String, required: true },
    Buyer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String },
      email: { type: String }
    },
    Artist: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String }
    },
    ArtType: { type: String, required: true },
    Size: { type: String, required: true },
    ColourPreferences: { type: [String], required: true },
    IsFramed: { type: Boolean, required: true },
    MinBudget: { type: Number, required: true },
    MaxBudget: { type: Number, required: true },
    PaymentTerm: { type: String, required: true },
    ExpectedDeadline: { type: Number, required: true }, 
    Comments: { type: String },
    RequestStatus: {
      type: String,
      enum: ['Approved', 'Rejected', 'Pending', 'Negotiating'],
      default: 'Pending',
    },
    BuyerStatus: {
      type: String,
      enum: ['Approved', 'Rejected','Pending'],
      default: 'Pending',
    },
    rejectedcomment:{type:String},
    NegotiatedBudget: { type: Number },
    Notes:{type: String ,required:false},
    BuyerNotes: { type: String },
    updateCount: { type: Number, default: 0 },
    isUpdated: { type: Boolean, default: false },
    Revisions: [{
      description: String,
      date: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuyerRequest", BuyerRequestSchema);