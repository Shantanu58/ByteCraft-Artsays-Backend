const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getCropsByArtist = async (req, res) => {
  try {
 
    const artists = await User.find({ userType: 'Artist' }).select('_id name lastName profilePhoto');

    if (artists.length === 0) {
      return res.status(404).json({ message: 'No artists found' });
    }

    const artistIds = artists.map(artist => artist._id);

  
    const crops = await Crop.find({ userId: { $in: artistIds } })
      .populate('userId', 'name lastName profilePhoto');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No crops found for artists' });
    }

    res.status(200).json({
      message: 'Crops fetched successfully',
      data: crops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching crops',
      error: error.message,
    });
  }
};

module.exports = getCropsByArtist;
