const BiddedProduct = require('../../../Models/biddedproduct');

const createBiddedProduct = async (req, res) => {
  try {
    const { buyer, product, totalPrice, paymentMethod } = req.body;


    if (!buyer || !product || !totalPrice || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newBiddedProduct = new BiddedProduct({
      buyer,
      product,
      totalPrice,
      paymentMethod,
    });

    await newBiddedProduct.save();
    res.status(201).json({ success: true, message: 'Bidded product created successfully', product: newBiddedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = createBiddedProduct;
