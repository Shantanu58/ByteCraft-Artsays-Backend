const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../../../Models/CropImage');
const productValidator = require('../../../Validators/Product/productvalidator');

const addProduct = async (req, res) => {
  try {

    const { error, value } = productValidator.validate(req.body);

    if (error) {

      if (req.files && req.files['images']) {
        req.files['images'].forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }


    const productData = {
      ...value,
      userId: value.userId,
      mainCategory: value.mainCategory, // Already the string value
      category: value.category,
      subCategory: value.subCategory,
      productType: value.productType,
      editionNumber: value.productType === 'limited' ? value.editionNumber : undefined,
      iframeLink: req.body.iframeLink || undefined,

      shippingCharges: value.shippingCharges,
      estimatedDelivery: value.estimatedDelivery,
      packagingType: value.packagingType,
      insuranceCoverage: value.insuranceCoverage || false,
      selfShipping: value.selfShipping || false,
      quantity: value.quantity,
      hsnCode: value.hsnCode || undefined,
      surfaceType: value.surfaceType || undefined,
      isSigned: value.isSigned,
      condition: value.condition,
      provenance: value.provenance || undefined,

      autoCancelOrder: value.autoCancelOrder || false,
      giftWrapping: value.giftWrapping || false,
      giftWrappingCustomMessage: value.giftWrappingCustomMessage || '',
      giftWrappingCost: value.giftWrappingCost || false,
      giftWrappingCostAmount: value.giftWrappingCost ? value.giftWrappingCostAmount : 0,

      // NFT Details
      blockchainNetwork: value.blockchainNetwork || undefined,
      smartContractAddress: value.smartContractAddress || undefined,
      tokenStandard: value.tokenStandard || undefined,
      tokenId: value.tokenId || undefined,
      walletAddress: value.walletAddress || undefined,
      royaltyPercentage: value.royaltyPercentage || undefined,
      mintingType: value.mintingType || undefined,
      licenseType: value.licenseType || undefined,
      ipfsStorage: value.ipfsStorage || false,
      unlockableContent: value.unlockableContent || false,
      partOfCollection: value.partOfCollection || false,
      collectionName: value.partOfCollection ? value.collectionName : undefined,
      rarityType: value.rarityType || undefined,
      traits: value.traits || undefined,
      // Legal & Compliance fields
      ownershipConfirmation: value.ownershipConfirmation,
      copyrightRights: value.copyrightRights,
      prohibitedItems: value.prohibitedItems,
      artistSignature: value.artistSignature,
      signatureType: value.signatureType || undefined,
      coaAvailable: value.coaAvailable,
      certificateFormat: value.certificateFormat || 'digital',


      certificateFile: req.files['certificateFile']
        ? `/uploads/certificates/${req.files['certificateFile'][0].filename}`
        : undefined,
      coaFile: req.files['coaFile']
        ? `/uploads/coa/${req.files['coaFile'][0].filename}`
        : undefined
    };

    if (value.coaAvailable) {
      productData.certificateType = value.certificateType;
      productData.issuerName = value.issuerName;
      productData.verificationNumber = value.verificationNumber;
    }



    if (req.files && req.files['images'] && req.files['images'].length > 0) {
      productData.mainImage = `/uploads/productImage/${req.files['images'][0].filename}`;

      if (req.files['images'].length > 1) {
        productData.otherImages = req.files['images']
          .slice(1)
          .map(file => `/uploads/productImage/${file.filename}`);
      }
    }


    if (!productData.finalPrice && productData.sellingPrice) {
      const discount = productData.discount || 0;
      productData.finalPrice = productData.sellingPrice * (1 - (discount / 100));
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('Error adding product:', error);


    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
 // Handle duplicate key error specifically
 if (error.code === 11000) {
  return res.status(400).json({
    message: 'Duplicate key error',
    details: ['This token ID already exists for the given smart contract']
  });
}
    res.status(500).json({
      message: 'Error while adding product',
      error: error.message
    });
  }
};

module.exports = addProduct;