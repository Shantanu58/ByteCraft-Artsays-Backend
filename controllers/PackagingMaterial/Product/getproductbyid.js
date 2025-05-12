const mongoose = require('mongoose');
const PackagingMaterial = require('../../../Models/PackagingMaterial');

const getPackagingMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid packaging material ID format' });
    }

    const material = await PackagingMaterial.findById(id).populate('userId', 'name lastName profilePhoto email website');

    if (!material) {
      return res.status(404).json({ message: 'Packaging material not found' });
    }

    res.status(200).json({
      message: 'Packaging material fetched successfully',
      data: material,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching packaging material',
      error: error.message,
    });
  }
};

module.exports = getPackagingMaterialById;