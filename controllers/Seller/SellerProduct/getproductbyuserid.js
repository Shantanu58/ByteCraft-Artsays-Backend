const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getCropsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('name lastName profilePhoto email website userType');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const crops = await Crop.find({ userId }).populate('userId', 'name lastName profilePhoto email website');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No Product found for this user' });
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

module.exports = getCropsByUser;