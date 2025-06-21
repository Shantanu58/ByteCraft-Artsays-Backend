const BuyerResellProduct = require('../../../Models/BuyerResellProductrequest');
const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getCombinedData = async (req, res) => {
  try {
    const { buyerId } = req.params; 

    if (!buyerId) {
      return res.status(400).json({ message: 'Buyer ID is required' });
    }


    const buyer = await User.findOne({ _id: buyerId, role: 'buyer' }).select(
      '_id name lastName profilePhoto email website'
    );

    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }


    const products = await BuyerResellProduct.find({ buyerId }).populate(
      'buyerId',
      'name lastName'
    );

  
    const crops = await Crop.find({ userId: buyerId }).populate(
      'userId',
      'name lastName profilePhoto email website'
    );

    if (products.length === 0 && crops.length === 0) {
      return res.status(404).json({
        message: 'No products or crops found for this buyer',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data fetched successfully',
      data: {
        buyer,
        products,
        crops,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message,
    });
  }
};

module.exports = getCombinedData;
