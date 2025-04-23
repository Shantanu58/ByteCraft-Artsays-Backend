const Product = require('../Models/artwork');  // Import the Product model

exports.createProduct = async (req, res) => {
  try {
    // Validate productSize format (optional)
    const productSizePattern = /^\d+\*\d+\s?cm$/;
    if (req.body.productSize && !productSizePattern.test(req.body.productSize)) {
      return res.status(400).json({ message: 'Invalid product size format. Use "Width*Height cm", e.g., "25*45 cm".' });
    }

    // Get the main image and additional images from the request files
    const mainImage = req.files.mainImage[0].path;
    const additionalImages = req.files.additionalImages.map(file => file.path);

    const productData = {
      mainImage,
      additionalImages,
      productName: req.body.productName,
      productNewPrice: req.body.productNewPrice,
      productOldPrice: req.body.productOldPrice,
      productSize: req.body.productSize,
      productDescription: req.body.productDescription,
      numberOfPurchases: req.body.numberOfPurchases || 0,
      paintedBy: req.body.paintedBy
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);  // Log error details
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};


exports.getProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve product', error });
    }
  };

  exports.getProducts = async (req, res) => {
    try {
      const product = await Product.find();
      if (!product.length) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve product', error });
    }
  };
    