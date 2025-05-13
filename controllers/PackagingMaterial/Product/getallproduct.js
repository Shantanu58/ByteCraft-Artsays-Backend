const PackagingMaterial = require('../../../Models/PackagingMaterial');

const getAllPackagingMaterials = async (req, res) => {
  try {
    const materials = await PackagingMaterial.find()
      .populate('userId', 'name lastName profilePhoto');

    if (materials.length === 0) {
      return res.status(404).json({ message: 'No packaging materials found' });
    }

    res.status(200).json({
      message: 'All packaging materials fetched successfully',
      data: materials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching packaging materials',
      error: error.message,
    });
  }
};

module.exports = getAllPackagingMaterials;
