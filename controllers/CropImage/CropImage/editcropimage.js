const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../../../Models/CropImage');
const productValidator = require('../../../Validators/Product/productvalidator');

const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    

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


    const existingProduct = await Product.findById(id).session(session);
    if (!existingProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }


    const updateData = {
      ...value,
      userId: value.userId,
      mainCategory: value.mainCategory, 
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
      editionSize: value.partOfCollection ? parseInt(value.editionSize) : undefined,
      rarityType: value.rarityType || undefined,
      traits: value.traits || undefined,

      originRegion: value.originRegion || undefined,
      periodEra: value.periodEra || undefined,
      antiqueCondition: value.antiqueCondition || undefined,
      restorationHistory: value.restorationHistory || undefined,
      provenanceHistory: value.provenanceHistory || undefined,
      engravingMarkings: value.engravingMarkings || undefined,
      patinaWear: value.patinaWear || undefined,
      isHandmade: value.isHandmade || false,
      originalReproduction: value.originalReproduction || undefined,
      museumExhibitionHistory: value.museumExhibitionHistory || undefined,
      customEngravingAvailable: value.customEngravingAvailable || false,


      addressLine1: value.addressLine1 || undefined,
      addressLine2: value.addressLine2 || undefined,
      landmark: value.landmark || undefined,
      city: value.city || undefined,
      state: value.state || undefined,
      country: value.country || undefined,
      pincode: value.pincode || undefined,


      ownershipConfirmation: value.ownershipConfirmation,
      copyrightRights: value.copyrightRights,
      prohibitedItems: value.prohibitedItems,
      artistSignature: value.artistSignature,
      signatureType: value.signatureType || undefined,
      coaAvailable: value.coaAvailable,
      certificateFormat: value.certificateFormat || 'digital'
    };


    if (req.files && req.files['certificateFile']) {
 
      if (existingProduct.certificateFile) {
        const oldFilePath = path.join(__dirname, '../../../', existingProduct.certificateFile);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.certificateFile = `/uploads/certificates/${req.files['certificateFile'][0].filename}`;
    }


    if (req.files && req.files['coaFile']) {
  
      if (existingProduct.coaFile) {
        const oldFilePath = path.join(__dirname, '../../../', existingProduct.coaFile);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.coaFile = `/uploads/coa/${req.files['coaFile'][0].filename}`;
    }


    if (value.coaAvailable) {
      updateData.certificateType = value.certificateType;
      updateData.issuerName = value.issuerName;
      updateData.verificationNumber = value.verificationNumber;
    }

    // Handle images
    if (req.files && req.files['images'] && req.files['images'].length > 0) {

      if (existingProduct.mainImage) {
        const oldFilePath = path.join(__dirname, '../../../', existingProduct.mainImage);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      updateData.mainImage = `/uploads/productImage/${req.files['images'][0].filename}`;


      if (existingProduct.otherImages && existingProduct.otherImages.length > 0) {
        existingProduct.otherImages.forEach(image => {
          const oldFilePath = path.join(__dirname, '../../../', image);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        });
      }

      if (req.files['images'].length > 1) {
        updateData.otherImages = req.files['images']
          .slice(1)
          .map(file => `/uploads/productImage/${file.filename}`);
      } else {
        updateData.otherImages = [];
      }
    }

    if (!updateData.finalPrice && updateData.sellingPrice) {
      const discount = updateData.discount || 0;
      updateData.finalPrice = updateData.sellingPrice * (1 - (discount / 100));
    }


    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error updating product:', error);


    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }


    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate key error',
        details: ['This token ID already exists for the given smart contract']
      });
    }

    res.status(500).json({
      message: 'Error while updating product',
      error: error.message
    });
  }
};

module.exports = updateProduct;