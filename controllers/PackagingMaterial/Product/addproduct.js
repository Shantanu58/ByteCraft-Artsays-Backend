const PackagingMaterial = require('../../../Models/PackagingMaterial');  

const addPackagingMaterial = async (req, res) => {
  try {
    const { productName, userId, price, category, mainImage, otherImages, description } = req.body;

   
    if (!productName || !userId || !price || !category || !mainImage) {
      return res.status(400).json({ message: 'All fields are required: productName, userId, price, category, mainImage' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const validCategories = ['Web Design', 'Photography', 'Technology', 'Lifestyle', 'Sports'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid packaging material category' });
    }

    console.log('Received packaging material data:', req.body);

    
    const newMaterial = new PackagingMaterial({
      productName,
      userId,  
      price,
      category,
      mainImage,
      otherImages: otherImages || [],
      description,
    });

    const savedMaterial = await newMaterial.save();

    res.status(201).json({
      message: 'Packaging material added successfully',
      data: savedMaterial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while adding packaging material',
      error: error.message,
    });
  }
};

module.exports = addPackagingMaterial;
