const BuyerResellProduct = require('../../../Models/BuyerResellProductrequest');


const createBuyerResellProduct = async (req, res) => {
  try {
    const product = new BuyerResellProduct(req.body);
    await product.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports =  createBuyerResellProduct ;
