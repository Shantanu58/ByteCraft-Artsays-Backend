const Crop = require('../../../Models/CropImage');

const updateCrop = async (req, res) => {
  try {
    const { id } = req.params; // Get the crop ID from URL
    const { productName, price, category, mainImage, otherImages, description } = req.body;

    // Validate required fields (excluding userId)
    if (!id || !productName || !price || !category || !mainImage) {
      return res.status(400).json({ message: 'All fields are required: id, productName, price, category, mainImage' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const validCategories = ['Web Design', 'Photography', 'Technology', 'Lifestyle', 'Sports'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid product category' });
    }

    // Find the crop by ID first
    const existingCrop = await Crop.findById(id);
    if (!existingCrop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Update only allowed fields, keeping userId unchanged
    existingCrop.productName = productName;
    existingCrop.price = price;
    existingCrop.category = category;
    existingCrop.mainImage = mainImage;
    existingCrop.otherImages = otherImages || [];
    existingCrop.description = description;

    const updatedCrop = await existingCrop.save();

    res.status(200).json({
      message: 'Crop updated successfully',
      data: updatedCrop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while updating crop',
      error: error.message,
    });
  }
};

module.exports = updateCrop;
