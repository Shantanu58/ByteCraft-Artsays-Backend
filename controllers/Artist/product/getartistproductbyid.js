const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getApprovedCropsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const artist = await User.findOne({ _id: artistId, userType: 'Artist' });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const crops = await Crop.find({ userId: artistId, status: 'Approved' })
      .populate('userId', 'name lastName profilePhoto');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No approved crops found for this artist' });
    }

    res.status(200).json({
      message: 'Approved crops fetched successfully',
      data: crops,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching approved crops for artist',
      error: error.message,
    });
  }
};

module.exports = getApprovedCropsByArtist;
