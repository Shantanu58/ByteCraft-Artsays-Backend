const mongoose = require('mongoose');  
const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');
const BuyerResellProductRequest = require('../../../Models/BuyerResellProductrequest');

const getProductOrCrop = async (req, res) => {
  try {
    const { userIdOrCropId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userIdOrCropId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const productRequest = await BuyerResellProductRequest.findById(userIdOrCropId)
      .populate('buyerId', 'name lastName profilePhoto email website');

    if (productRequest) {
      return res.status(200).json({
        message: 'Product request fetched successfully',
        data: productRequest,
      });
    }

    const buyer = await User.findOne({ _id: userIdOrCropId })
      .select('_id name lastName profilePhoto email website');

    if (!buyer) {
      return res.status(404).json({ message: 'User not found' });
    }

    const crops = await Crop.find({ userId: buyer._id }).populate('userId', 'name lastName profilePhoto email website');

    return res.status(200).json({
      message: crops.length > 0 ? 'Products fetched successfully' : 'User found, but no products available',
      buyer,
      data: crops,
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: 'Error fetching data',
      error: error.message,
    });
  }
};

module.exports = getProductOrCrop;