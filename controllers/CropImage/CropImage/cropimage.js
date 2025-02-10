const Crop = require('../../../Models/CropImage');  

const addCrop = async (req, res) => {
  try {
    const { mainImage, otherImages } = req.body;

    if (!mainImage) {
      return res.status(400).json({ message: 'Main image is required' });
    }

    console.log('Received crop data:', req.body);

    const newCrop = new Crop({
      mainImage,
      otherImages: otherImages || [],
    });

    const savedCrop = await newCrop.save();

    res.status(201).json({
      message: 'Crop added successfully',
      data: savedCrop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while adding crop',
      error: error.message,
    });
  }
};

module.exports = addCrop;
