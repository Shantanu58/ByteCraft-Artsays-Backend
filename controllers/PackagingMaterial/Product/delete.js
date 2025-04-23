const PackagingMaterial = require('../../../Models/PackagingMaterial');


const deletePackagingMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await PackagingMaterial.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return res.status(404).json({ message: 'Packaging material not found' });
    }

    res.status(200).json({
      message: 'Packaging material deleted successfully',
      data: deletedMaterial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error deleting packaging material',
      error: error.message,
    });
  }
};

module.exports = deletePackagingMaterial;