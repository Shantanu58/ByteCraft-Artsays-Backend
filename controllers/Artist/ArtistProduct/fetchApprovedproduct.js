const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getApprovedCropsByArtist = async (req, res) => {
  try {
   
    const artists = await User.find({ userType: 'Artist' })
      .select('_id name lastName profilePhoto');

    if (artists.length === 0) {
      return res.status(404).json({ message: 'No artists found' });
    }

    const artistIds = artists.map(artist => artist._id);

  
    const crops = await Crop.find({ userId: { $in: artistIds }, status: 'Approved' })
      .populate('userId', 'name lastName profilePhoto');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No approved crops found for artists' });
    }

    res.status(200).json({
      message: 'Approved crops from artists fetched successfully',
      data: crops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching approved crops from artists',
      error: error.message,
    });
  }
};

module.exports = getApprovedCropsByArtist;
