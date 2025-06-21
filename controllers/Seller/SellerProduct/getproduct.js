const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getCropsBySeller = async (req, res) => {
  try {
    const sellers = await User.find({ userType: 'Seller' }).select('_id name lastName profilePhoto email website ');

    if (sellers.length === 0) {
      return res.status(404).json({ message: 'No sellers found' });
    }

    const sellerIds = sellers.map(seller => seller._id);

    const crops = await Crop.find({ userId: { $in: sellerIds } })
      .populate('userId', 'name lastName profilePhoto email website');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No Product found for sellers' });
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

module.exports = getCropsBySeller;
