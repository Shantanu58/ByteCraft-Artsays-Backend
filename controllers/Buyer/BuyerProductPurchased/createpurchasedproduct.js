// const express = require('express');
// const Purchase = require('../../../Models/BuyerProductPurchased'); 
// const Crop = require('../../../Models/CropImage');

// const createPurchase = async (req, res) => {
//   try {
//     const { buyer, product, quantity, paymentMethod } = req.body;

//     const productData = await Crop.findById(product);
//     if (!productData) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const totalPrice = productData.price * quantity;

//     const newPurchase = new Purchase({
//       buyer,
//       product:product|| null,
//       quantity,
//       totalPrice,
//       paymentMethod,
//     });

//     await newPurchase.save();
//     res.status(201).json({ message: 'Purchase successful', purchase: newPurchase });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = createPurchase ;

const express = require('express');
const Purchase = require('../../../Models/BuyerProductPurchased'); 
const Crop = require('../../../Models/CropImage');
const BuyerResellProduct = require('../../../Models/BuyerResellProductrequest');

const createPurchase = async (req, res) => {
  try {
    const { buyer, product, resellProduct, quantity, paymentMethod } = req.body;

    let productData;
    let totalPrice;

  
    if (product && resellProduct) {
      return res.status(400).json({ message: 'Choose either product (Crop) or resellProduct, not both.' });
    }

    if (product) {
      productData = await Crop.findById(product);
      if (!productData) {
        return res.status(404).json({ message: 'Original product (Crop) not found' });
      }
    } else if (resellProduct) {
      productData = await BuyerResellProduct.findById(resellProduct);
      if (!productData) {
        return res.status(404).json({ message: 'Resell product not found' });
      }
    } else {
      return res.status(400).json({ message: 'Provide either product or resellProduct.' });
    }

    totalPrice = productData.price * quantity;


    const newPurchase = new Purchase({
      buyer,
      product: product || null,
      resellProduct: resellProduct || null,
      quantity,
      totalPrice,
      paymentMethod,
    });

    await newPurchase.save();
    res.status(201).json({ message: 'Purchase successful', purchase: newPurchase });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createPurchase;
