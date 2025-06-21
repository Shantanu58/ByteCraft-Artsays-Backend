const mongoose = require('mongoose');
const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getProductByArtist = async (req, res) => {
  try {
    const { userId } = req.params;
    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      return res.status(400).json({ message: 'User ID is required' });
    }


    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }


    const artist = await User.findOne({ _id: trimmedUserId, userType: 'Artist' }).select('_id name lastName profilePhoto');

    if (!artist) {
      return res.status(404).json({ message: 'User not found or not an artist' });
    }


    const crops = await Crop.find({ userId: artist._id }).populate('userId', 'name lastName profilePhoto');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No Product found for this artist' });
    }


    res.status(200).json({
      message: 'Product fetched successfully',
      artist,
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

module.exports = getProductByArtist;
