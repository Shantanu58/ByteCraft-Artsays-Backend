const Product = require('../../../Models/CropImage');

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json({
      message: 'Product fetched successfully',
      data: product
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      message: 'Error while fetching product',
      error: error.message
    });
  }
};

module.exports = getProductById;
