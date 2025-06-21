// const mongoose = require('mongoose');
// const Crop = require('../../../Models/BuyerProductPurchased');

// const getCropById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid crop ID format' });
//     }

//     const crop = await Crop.findById(id)
//       .populate('buyer', 'name lastName email website profilePhoto') 
//       .populate('product', ' productName category price  description mainImage otherImages') 
//       .populate('resellProduct', ' productName category price  description mainImage otherImages'); 

//     if (!crop) {
//       return res.status(404).json({ message: 'Crop not found' });
//     }

//     res.status(200).json({
//       message: 'Crop fetched successfully',
//       data: crop,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Error fetching crop',
//       error: error.message,
//     });
//   }
// };

// module.exports = getCropById;

const mongoose = require('mongoose');
const Crop = require('../../../Models/CropImage');
const BuyerProductPurchased = require('../../../Models/BuyerProductPurchased');
const PackagingMaterialPurchased = require('../../../Models/Packagingmaterialpurchased');

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    let item = await BuyerProductPurchased.findById(id)
      .populate('buyer', 'name lastName email website profilePhoto')
      .populate('product', 'productName category price description mainImage otherImages')
      .populate('resellProduct', 'productName category price description mainImage otherImages');

    if (!item) {
      item = await PackagingMaterialPurchased.findById(id)
        .populate('user', 'name lastName email phone')
        .populate({
          path: 'product',
          populate: {
            path: 'userId',
            model: 'User',
            select: 'name lastName',
          },
        })
        .populate('product', 'productName price category description mainImage otherImages');
    }

    if (!item) {
      item = await Crop.findById(id).populate('userId', 'name lastName profilePhoto email website');
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({
      message: 'Item fetched successfully',
      data: item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching item',
      error: error.message,
    });
  }
};

module.exports = getItemById;

