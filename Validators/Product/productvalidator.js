const Joi = require('joi');
const mongoose = require('mongoose');

const productValidator = Joi.object({
  productName: Joi.string().required().trim().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required'
  }),
  userId: Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required',
    'any.invalid': 'Invalid User ID format'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),
  tags: Joi.array().items(Joi.string()).default([]),
  medium: Joi.string().required().messages({
    'string.empty': 'Medium is required',
    'any.required': 'Medium is required'
  }),
  materials: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one material must be specified',
    'any.required': 'Materials are required'
  }),
  dimensions: Joi.string().required().messages({
    'string.empty': 'Dimensions are required',
    'any.required': 'Dimensions are required'
  }),
  weight: Joi.number().min(0).messages({
    'number.min': 'Weight cannot be negative'
  }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
    'number.min': 'Year must be 1900 or later',
    'number.max': 'Year cannot be in the future',
    'any.required': 'Year of creation is required'
  }),
  editionType: Joi.string().valid('original', 'limited', 'open').required().messages({
    'any.only': 'Invalid edition type',
    'any.required': 'Edition type is required'
  }),
  framing: Joi.string().valid('framed', 'unframed', 'rolled').required().messages({
    'any.only': 'Invalid framing option',
    'any.required': 'Framing details are required'
  }),
  iframeLink: Joi.string().uri().allow('').messages({
    'string.uri': 'Please enter a valid URL for the iframe link'
  }),
  mainImage: Joi.string(),
  otherImages: Joi.array().items(Joi.string()).default([]),
  sellingPrice: Joi.number().min(0).required().messages({
    'number.min': 'Selling price cannot be negative',
    'any.required': 'Selling price is required'
  }),
  marketPrice: Joi.number().min(0).messages({
    'number.min': 'Market price cannot be negative'
  }),
  discount: Joi.number().min(0).max(100).messages({
    'number.min': 'Discount cannot be negative',
    'number.max': 'Discount cannot exceed 100%'
  }),
  finalPrice: Joi.number().min(0).required().messages({
    'number.min': 'Final price cannot be negative',
    'any.required': 'Final price is required'
  }),
  offers: Joi.array().items(Joi.string().valid(
    'festival',
    'new_customer',
    'bulk_purchase',
    'artist_special'
  )).default([]),
  allowInstallments: Joi.boolean().default(false),
  status: Joi.string().valid('Pending', 'Approved', 'Rejected').default('Pending'),

  // Add these new fields for Shipping & Delivery
  shippingCharges: Joi.number().min(0).required().messages({
    'number.min': 'Shipping charges cannot be negative',
    'any.required': 'Shipping charges are required'
  }),
  estimatedDelivery: Joi.string().required().messages({
    'string.empty': 'Estimated delivery time is required',
    'any.required': 'Estimated delivery time is required'
  }),
  packagingType: Joi.string().required().messages({
    'string.empty': 'Packaging type is required',
    'any.required': 'Packaging type is required'
  }),
  insuranceCoverage: Joi.boolean().default(false),
  selfShipping: Joi.boolean().default(false),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required'
  }),
  hsnCode: Joi.string().trim().allow('').messages({
    'string.empty': 'HSN Code cannot be empty'
  }),
  surfaceType: Joi.string().trim().allow('').messages({
    'string.empty': 'Surface type cannot be empty'
  }),
  isSigned: Joi.boolean().required().messages({
    'any.required': 'Signature status is required'
  }),
  condition: Joi.string().valid('new', 'resale', 'pre_owned').required().messages({
    'any.only': 'Invalid condition value',
    'any.required': 'Condition is required'
  }),
  provenance: Joi.string().trim().allow('').messages({
    'string.empty': 'Provenance cannot be empty'
  }),
  autoCancelOrder: Joi.boolean().default(false),
  giftWrapping: Joi.boolean().default(false),
  giftWrappingCustomMessage: Joi.string().trim().allow('').default('').messages({
    'string.empty': 'Custom message cannot be empty'
  }),
  giftWrappingCost: Joi.boolean().default(false),
  giftWrappingCostAmount: Joi.number().min(0).default(0).when('giftWrappingCost', {
    is: true,
    then: Joi.number().min(0).required().messages({
      'number.min': 'Wrapping cost cannot be negative',
      'any.required': 'Wrapping cost amount is required when gift wrapping cost is enabled'
    }),
    otherwise: Joi.number().min(0).default(0)
  }),
  // Legal & Compliance validations
  ownershipConfirmation: Joi.boolean().required().messages({
    'any.required': 'Ownership confirmation is required'
  }),
  copyrightRights: Joi.string()
    .valid('full_rights', 'personal_use', 'no_rights')
    .required()
    .messages({
      'any.only': 'Invalid copyright rights option',
      'any.required': 'Copyright rights are required'
    }),
  prohibitedItems: Joi.boolean().required().messages({
    'any.required': 'Prohibited items confirmation is required'
  }),
  artistSignature: Joi.boolean().required().messages({
    'any.required': 'Artist signature status is required'
  }),
  signatureType: Joi.string().trim().allow(''),
  coaAvailable: Joi.boolean().required().messages({
    'any.required': 'COA availability is required'
  }),
  certificateType: Joi.string()
    .valid('artist_signed', 'third_party', 'museum', 'gallery')
    .when('coaAvailable', {
      is: true,
      then: Joi.string().required().messages({
        'any.required': 'Certificate type is required when COA is available'
      })
    }),
  issuerName: Joi.string().trim().when('coaAvailable', {
    is: true,
    then: Joi.string().required().messages({
      'string.empty': 'Issuer name is required when COA is available',
      'any.required': 'Issuer name is required when COA is available'
    })
  }),
  verificationNumber: Joi.string().trim().when('coaAvailable', {
    is: true,
    then: Joi.string().required().messages({
      'string.empty': 'Verification number is required when COA is available',
      'any.required': 'Verification number is required when COA is available'
    })
  }),
  certificateFormat: Joi.string()
    .valid('digital', 'physical')
    .default('digital'),
  certificateFile: Joi.string(),
  coaFile: Joi.string(),

  mainCategory: Joi.string().required().messages({
    'string.empty': 'Main category is required',
    'any.required': 'Main category is required'
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required'
  }),
  subCategory: Joi.string().required().messages({
    'string.empty': 'Subcategory is required',
    'any.required': 'Subcategory is required'
  }),
  productType: Joi.string()
    .valid('original', 'limited', 'open', 'nft')
    .required()
    .messages({
      'any.only': 'Invalid product type',
      'any.required': 'Product type is required'
    }),
  editionNumber: Joi.when('productType', {
    is: 'limited',
    then: Joi.number().integer().min(1).required().messages({
      'number.base': 'Edition number must be a number',
      'number.min': 'Edition number must be at least 1',
      'any.required': 'Edition number is required for limited edition products'
    }),
    otherwise: Joi.number().integer().min(1).optional()
  }),

  // NFT Details (all optional)
  // NFT Details validations
  blockchainNetwork: Joi.string().trim()
    .when('productType', {
      is: 'nft',
      then: Joi.string().trim().required().messages({
        'string.empty': 'Blockchain network is required for NFTs',
        'any.required': 'Blockchain network is required for NFTs'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  smartContractAddress: Joi.string().trim()
    .when('productType', {
      is: 'nft',
      then: Joi.string().trim().required().messages({
        'string.empty': 'Smart contract address is required for NFTs',
        'any.required': 'Smart contract address is required for NFTs'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  tokenStandard: Joi.string().trim()
    .when('productType', {
      is: 'nft',
      then: Joi.string().trim().required().messages({
        'string.empty': 'Token standard is required for NFTs',
        'any.required': 'Token standard is required for NFTs'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  tokenId: Joi.string().trim()
    .when('productType', {
      is: 'nft',
      then: Joi.string().trim().required().messages({
        'string.empty': 'Token ID is required for NFTs',
        'any.required': 'Token ID is required for NFTs'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  walletAddress: Joi.string().trim()
    .when('productType', {
      is: 'nft',
      then: Joi.string().trim().required().messages({
        'string.empty': 'Wallet address is required for NFTs',
        'any.required': 'Wallet address is required for NFTs'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  royaltyPercentage: Joi.alternatives().try(
    Joi.number().min(0).max(50),
    Joi.string().allow('').regex(/^\d*\.?\d+$/)
  )
    .when('productType', {
      is: 'nft',
      then: Joi.required().messages({
        'alternatives.types': 'Royalty percentage must be a number between 0 and 50',
        'number.min': 'Royalty percentage cannot be negative',
        'number.max': 'Royalty percentage cannot exceed 50%',
        'any.required': 'Royalty percentage is required for NFTs'
      }),
      otherwise: Joi.optional()
    }),
  mintingType: Joi.string().valid('pre_minted', 'lazy')
    .when('productType', {
      is: 'nft',
      then: Joi.required().messages({
        'any.required': 'Minting type is required for NFTs',
        'any.only': 'Minting type must be either pre_minted or lazy'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  licenseType: Joi.string().valid('personal', 'limited', 'full', 'exclusive')
    .when('productType', {
      is: 'nft',
      then: Joi.required().messages({
        'any.required': 'License type is required for NFTs',
        'any.only': 'License type must be one of personal, limited, full, or exclusive'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  ipfsStorage: Joi.boolean().default(false),
  unlockableContent: Joi.boolean().default(false),
  partOfCollection: Joi.boolean().default(false)
  .when('productType', {
    is: 'nft',
    then: Joi.required().messages({
      'any.required': 'Part of collection is required for NFTs'
    }),
    otherwise: Joi.optional()
  }),
collectionName: Joi.when('partOfCollection', {
  is: true,
  then: Joi.string().trim().required().messages({
    'string.empty': 'Collection name is required when part of collection',
    'any.required': 'Collection name is required when part of collection'
  }),
  otherwise: Joi.string().trim().allow('')
}),
editionSize: Joi.when('partOfCollection', {
  is: true,
  then: Joi.number().integer().min(1).required().messages({
    'number.base': 'Edition size must be a number',
    'number.min': 'Edition size must be at least 1',
    'any.required': 'Edition size is required when part of collection'
  }),
  otherwise: Joi.number().integer().min(1).optional()
}),
// addressLine1: Joi.when('partOfCollection', {
//   is: true,
//   then: Joi.string().trim().required().messages({
//     'string.empty': 'Address line 1 is required when part of collection',
//     'any.required': 'Address line 1 is required when part of collection'
//   })
// }),
// addressLine2: Joi.string().trim().allow('').optional().messages({
//   'string.empty': 'Address line 2 must be a valid string or empty'
// }),
// landmark: Joi.string().trim().allow('').optional(),
// city: Joi.when('partOfCollection', {
//   is: true,
//   then: Joi.string().trim().required().messages({
//     'string.empty': 'City is required when part of collection',
//     'any.required': 'City is required when part of collection'
//   })
// }),
// state: Joi.when('partOfCollection', {
//   is: true,
//   then: Joi.string().trim().required().messages({
//     'string.empty': 'State is required when part of collection',
//     'any.required': 'State is required when part of collection'
//   })
// }),
// country: Joi.when('partOfCollection', {
//   is: true,
//   then: Joi.string().trim().required().messages({
//     'string.empty': 'Country is required when part of collection',
//     'any.required': 'Country is required when part of collection'
//   })
// }),
// pincode: Joi.when('partOfCollection', {
//   is: true,
//   then: Joi.string().trim().required().messages({
//     'string.empty': 'Pincode is required when part of collection',
//     'any.required': 'Pincode is required when part of collection'
//   })
// }),
  rarityType: Joi.string().valid('common', 'rare', 'epic', 'legendary')
    .when('productType', {
      is: 'nft',
      then: Joi.required().messages({
        'any.required': 'Rarity type is required for NFTs',
        'any.only': 'Rarity type must be one of common, rare, epic, or legendary'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
  traits: Joi.string().trim()
    .when('productType', {
      is: 'nft',
      then: Joi.string().trim().required().messages({
        'string.empty': 'Traits are required for NFTs',
        'any.required': 'Traits are required for NFTs'
      }),
      otherwise: Joi.string().trim().allow('')
    }),
    // Antique & Vintage validations
originRegion: Joi.string()
.valid('france', 'japan', 'india', 'china', 'uk', 'usa')
.when('mainCategory', {
  is: 'Antiques & Vintage',
  then: Joi.required().messages({
    'any.required': 'Origin/Region is required for antiques',
    'any.only': 'Invalid origin/region value'
  }),
  otherwise: Joi.optional()
}),
periodEra: Joi.string()
.valid('victorian', 'art_deco', 'ming', 'edwardian', 'georgian')
.when('mainCategory', {
  is: 'Antiques & Vintage',
  then: Joi.required().messages({
    'any.required': 'Period/Era is required for antiques',
    'any.only': 'Invalid period/era value'
  }),
  otherwise: Joi.optional()
}),
antiqueCondition: Joi.string()
.valid('new', 'excellent', 'good', 'fair', 'poor')
.when('mainCategory', {
  is: 'Antiques & Vintage',
  then: Joi.required().messages({
    'any.required': 'Condition is required for antiques',
    'any.only': 'Invalid condition value'
  }),
  otherwise: Joi.optional()
}),
restorationHistory: Joi.string().trim().allow(''),
provenanceHistory: Joi.string().trim().allow(''),
engravingMarkings: Joi.string().trim().allow(''),
patinaWear: Joi.string().trim().allow(''),
isHandmade: Joi.boolean().default(false),
originalReproduction: Joi.string()
.valid('original', 'replica', 'reproduction')
.when('mainCategory', {
  is: 'Antiques & Vintage',
  then: Joi.required().messages({
    'any.required': 'Original/Reproduction is required for antiques',
    'any.only': 'Invalid original/reproduction value'
  }),
  otherwise: Joi.optional()
}),
museumExhibitionHistory: Joi.string().trim().allow(''),
customEngravingAvailable: Joi.boolean().default(false),

addressLine1: Joi.string().trim().allow('').optional().messages({
  'string.empty': 'Address line 1 must be a valid string or empty'
}),
addressLine2: Joi.string().trim().allow('').optional().messages({
  'string.empty': 'Address line 2 must be a valid string or empty'
}),
landmark: Joi.string().trim().allow('').optional(),
city: Joi.string().trim().allow('').optional().messages({
  'string.empty': 'City must be a valid string or empty'
}),
state: Joi.string().trim().allow('').optional().messages({
  'string.empty': 'State must be a valid string or empty'
}),
country: Joi.string().trim().allow('').optional().messages({
  'string.empty': 'Country must be a valid string or empty'
}),
pincode: Joi.string().trim().allow('').optional().messages({
  'string.empty': 'Pincode must be a valid string or empty'
}),

});

module.exports = productValidator;