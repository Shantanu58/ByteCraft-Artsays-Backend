const Image = require('../../../Models/CropImage');

const getImages = async (req, res) => {
  try {
    const images = await Image.find();  

    if (!images.length) {
      return res.status(404).json({ message: 'No images found' });
    }

    res.status(200).json({
      message: 'Images retrieved successfully',
      data: images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while retrieving images',
      error: error.message,
    });
  }
};

module.exports = getImages;
