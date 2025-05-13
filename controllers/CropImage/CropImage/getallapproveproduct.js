const Crop = require('../../../Models/CropImage');

const getApprovedCrops = async (req, res) => {
  try {

    const crops = await Crop.find({ status: 'Approved' })
      .populate('userId', 'name lastName profilePhoto');

    if (crops.length === 0) {
      return res.status(404).json({ message: 'No approved crops found' });
    }

    res.status(200).json({
      message: 'Approved crops fetched successfully',
      data: crops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching approved crops',
      error: error.message,
    });
  }
};

module.exports = getApprovedCrops;
