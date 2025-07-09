const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mainCategory: {
      type: String,
      ref: 'MainCategory',
      required: true
    },
    category: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subCategory: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true
    },
    productType: {
      type: String,
      enum: ['original', 'limited', 'open', 'nft'],
      required: true
    },
    editionNumber: {
      type: Number,
      min: 1
    },
    description: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    medium: {
      type: String,
      required: true
    },
    materials: {
      type: [String],
      required: true
    },
    dimensions: {
      type: String,
      required: true
    },
    weight: {
      type: Number
    },
    year: {
      type: Number,
      required: true
    },
    editionType: {
      type: String,
      enum: ['original', 'limited', 'open'],
      required: true
    },
    framing: {
      type: String,
      enum: ['framed', 'unframed', 'rolled'],
      required: true
    },
    mainImage: {
      type: String,
      required: true
    },
    otherImages: {
      type: [String],
      default: []
    },
    iframeLink: {
      type: String
    },
    //  pricing fields
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    marketPrice: {
      type: Number,
      min: 0
    },
    discount: {
      type: Number,
      min: 0,
      max: 100
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    offers: {
      type: [String],
      default: []
    },
    allowInstallments: {
      type: Boolean,
      default: false
    },
    installmentDuration: {
      type: [Number], 
      default: [],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },

    // Add Shipping & Delivery fields
    shippingCharges: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedDelivery: {
      type: String,
      required: true
    },
    packagingType: {
      type: String,
      required: true,
      enum: ['secure_box', 'wooden_crate', 'tube', 'bubble_wrap']
    },
    insuranceCoverage: {
      type: Boolean,
      default: false
    },
    selfShipping: {
      type: Boolean,
      default: false
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    hsnCode: {
      type: String,
      trim: true
    },
    surfaceType: {
      type: String
    },
    isSigned: {
      type: Boolean,
      required: true,
      default: false
    },
    condition: {
      type: String,
      enum: ['new', 'resale', 'pre_owned'],
      required: true
    },
    provenance: {
      type: String,
      trim: true
    },
    autoCancelOrder: {
      type: Boolean,
      default: false
    },
    giftWrapping: {
      type: Boolean,
      default: false
    },
    giftWrappingCustomMessage: {
      type: String,
      trim: true,
      default: ''
    },
    giftWrappingCost: {
      type: Boolean,
      default: false
    },
    giftWrappingCostAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    // Legal & Compliance fields
    ownershipConfirmation: {
      type: Boolean,
      required: true,
      default: false
    },
    copyrightRights: {
      type: String,
      enum: ['full_rights', 'personal_use', 'no_rights'],
      required: true
    },
    prohibitedItems: {
      type: Boolean,
      required: true,
      default: false
    },
    artistSignature: {
      type: Boolean,
      required: true,
      default: false
    },
    signatureType: {
      type: String,
      trim: true
    },
    coaAvailable: {
      type: Boolean,
      required: true,
      default: false
    },
    certificateType: {
      type: String,
      enum: ['artist_signed', 'third_party', 'museum', 'gallery']
    },
    issuerName: {
      type: String,
      trim: true
    },
    verificationNumber: {
      type: String,
      trim: true
    },
    certificateFormat: {
      type: String,
      enum: ['digital', 'physical'],
      default: 'digital'
    },
    certificateFile: {
      type: String
    },
    coaFile: {
      type: String
    },

    // NFT Details 
    blockchainNetwork: {
      type: String,
      trim: true
    },
    smartContractAddress: {
      type: String,
      trim: true
    },
    tokenStandard: {
      type: String,
      trim: true
    },
    tokenId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    walletAddress: {
      type: String,
      trim: true
    },
    royaltyPercentage: {
      type: Number,
      min: 0,
      max: 50,
    },
    mintingType: {
      type: String,
      enum: ['pre_minted', 'lazy']
    },
    licenseType: {
      type: String,
      enum: ['personal', 'limited', 'full', 'exclusive']
    },
    ipfsStorage: {
      type: Boolean,
      default: false
    },
    unlockableContent: {
      type: Boolean,
      default: false
    },
    partOfCollection: {
      type: Boolean,
      default: false
    },
    collectionName: {
      type: String,
      trim: true
    },
    editionSize: {
      type: Number,
      min: 1
    },
    addressLine1: {
      type: String,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    rarityType: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary']
    },
    traits: {
      type: String,
      trim: true
    },

    // Antique & Vintage Details
    originRegion: {
      type: String,
      enum: ['france', 'japan', 'india', 'china', 'uk', 'usa']
    },
    periodEra: {
      type: String,
      enum: ['victorian', 'art_deco', 'ming', 'edwardian', 'georgian']
    },
    antiqueCondition: {
      type: String,
      enum: ['new', 'excellent', 'good', 'fair', 'poor']
    },
    restorationHistory: {
      type: String,
      trim: true
    },
    provenanceHistory: {
      type: String,
      trim: true
    },
    engravingMarkings: {
      type: String,
      trim: true
    },
    patinaWear: {
      type: String,
      trim: true
    },
    isHandmade: {
      type: Boolean,
      default: false
    },
    originalReproduction: {
      type: String,
      enum: ['original', 'replica', 'reproduction']
    },
    museumExhibitionHistory: {
      type: String,
      trim: true
    },
    customEngravingAvailable: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

productSchema.index({ createdAt: 1 });
productSchema.index({ medium: 1 });
productSchema.index({ materials: 1 });
productSchema.index({ year: 1 });
productSchema.index({ sellingPrice: 1 });
productSchema.index({ finalPrice: 1 });
productSchema.index({ shippingCharges: 1 });
productSchema.index({ packagingType: 1 });
productSchema.index({ surfaceType: 1 });
productSchema.index({ condition: 1 });
productSchema.index({ isSigned: 1 });
productSchema.index({ ownershipConfirmation: 1 });
productSchema.index({ copyrightRights: 1 });
productSchema.index({ coaAvailable: 1 });

module.exports = mongoose.model('Product', productSchema);