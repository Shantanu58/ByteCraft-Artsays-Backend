const mongoose = require('mongoose');
const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');
const BuyerResellProduct = require('../../../Models/BuyerResellProductrequest');

const getProductByBuyer = async (req, res) => {
  try {
    const { userId } = req.params;
    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const buyer = await User.findOne({ _id: trimmedUserId, userType: 'Buyer' }).select('_id name lastName profilePhoto');

    if (!buyer) {
      return res.status(404).json({ message: 'User not found or not a buyer' });
    }

    const crops = await Crop.find({ userId: buyer._id }).populate('userId', 'name lastName profilePhoto');
    const resellProducts = await BuyerResellProduct.find({ buyerId: buyer._id }).populate('buyerId', 'name lastName profilePhoto');

    if (crops.length === 0 && resellProducts.length === 0) {
      return res.status(404).json({ message: 'No products found for this buyer' });
    }

    res.status(200).json({
      message: 'Products fetched successfully',
      buyer,
      crops,
      resellProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

module.exports = getProductByBuyer;