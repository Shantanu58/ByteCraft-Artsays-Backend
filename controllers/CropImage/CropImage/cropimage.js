const Crop = require('../../../Models/CropImage');  

const addCrop = async (req, res) => {
  try {
    const { productName, userId, price, category, mainImage, otherImages, description } = req.body;

    // Validate required fields
    if (!productName || !userId || !price || !category || !mainImage) {
      return res.status(400).json({ message: 'All fields are required: productName, userId, price, category, mainImage' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const validCategories = ['Web Design', 'Photography', 'Technology', 'Lifestyle', 'Sports'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid product category' });
    }

    console.log('Received crop data:', req.body);

    // Create a new Crop document
    const newCrop = new Crop({
      productName,
      userId,  
      price,
      category,
      mainImage,
      otherImages: otherImages || [],
      description,
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
