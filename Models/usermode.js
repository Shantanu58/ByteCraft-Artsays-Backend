const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true, },
  password: { type: String, required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  blogCount: { type: Number, default: 0 },
  userType: { type: String, required: true, enum: ['Artist', 'Buyer', 'Super-Admin', 'Admin', 'Seller'] },
  role: { type: String, enum: ['super-admin', 'admin', 'artist', 'buyer', 'seller'], required: true, strictPopulate: false },
  refreshToken: { type: String },

  resetPasswordOtp: { type: String },
  resetPasswordOtpExpiry: { type: Date },
  // Address fields for updating user profile
  address: {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    landmark: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    pincode: { type: String, default: '' },
  },
  gender: { type: String, required: false },
  birthdate: {
    type: Date,
  },
  bio: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  profilePhoto: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  username: { type: String, unique: true },

  instagram: { type: String },

  youtube: { type: String },

  facebook: { type: String },

  linkdin: { type: String },

  artistDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtistDetails' },
  bankDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'BankDetails' },
  artworklisting: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
  businessProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile' },
  sellingdetailsartwork: { type: mongoose.Schema.Types.ObjectId, ref: 'SellDetailsAndArtwork' },
  taxlegalcompliance: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxLegalCompliance' },


  agreements: [{ type: String }],

  verification: {
    type: {
      documentType: {
        type: String,
        enum: ['Aadhar Card', 'Driving License', 'Passport'],
        required: false,
      },
      documentNumber: {
        type: String,
        required: false,
        validate: {
          validator: function (value) {
            if (this.documentType === 'Aadhar Card') {
              return /^[2-9]{1}[0-9]{11}$/.test(value);
            } else if (this.documentType === 'Driving License') {
              return /^[A-Z]{2}-\d{2}-\d{8}$/.test(value);
            }
            else if (this.documentType === 'Passport') {
              return /^[A-Z][0-9]{7}$/.test(value);
            }

            return true;
          },
          message: props => `Invalid ${props.value} for ${props.documentType}`,
        },
      },
      documentFile: { type: String, required: false },
    },
    default: {},
  },

  status: { type: String, enum: ['Verified', 'Unverified', 'Rejected'], default: 'Unverified' },
  Rejcectcomment: { type: String }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
