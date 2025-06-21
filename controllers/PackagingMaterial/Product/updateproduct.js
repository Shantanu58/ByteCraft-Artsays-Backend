const PackagingMaterial = require('../../../Models/PackagingMaterial');

const updatePackagingMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, userId, price, category, mainImage, otherImages, description } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Material ID is required' });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const validCategories = ['Web Design', 'Photography', 'Technology', 'Lifestyle', 'Sports'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid packaging material category' });
    }

    const updatedMaterial = await PackagingMaterial.findByIdAndUpdate(
      id,
      { productName, userId, price, category, mainImage, otherImages, description },
      { new: true, runValidators: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Packaging material not found' });
    }

    res.status(200).json({
      message: 'Packaging material updated successfully',
      data: updatedMaterial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while updating packaging material',
      error: error.message,
    });
  }
};

module.exports = updatePackagingMaterial;
