const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getCropsByBuyer = async (req, res) => {
  try {

    const buyers = await User.find({ userType: 'Buyer' }).select('_id name lastName profilePhoto email website ');

    if (buyers.length === 0) {
      return res.status(404).json({ message: 'No buyers found' });
    }

    const buyerIds = buyers.map(buyer => buyer._id);


    const crops = await Crop.find({ userId: { $in: buyerIds } })
      .populate('userId', 'name lastName profilePhoto email website');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No Product found for buyers' });
    }

    res.status(200).json({
      message: 'Product fetched successfully',
      data: crops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching Product',
      error: error.message,
    });
  }
};

module.exports = getCropsByBuyer;
