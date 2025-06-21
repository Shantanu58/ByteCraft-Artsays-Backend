const Purchase = require('../../../Models/Packagingmaterialpurchased'); 
const PackagingMaterial = require('../../../Models/PackagingMaterial');



const createPurchase = async (req, res) => {
  try {
    const { user, product, quantity, paymentMethod } = req.body;


    const productData = await PackagingMaterial.findById(product);
    if (!productData) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalPrice = productData.price * quantity;


    const newPurchase = new Purchase({
      user,
      product,
      quantity,
      totalPrice,
      paymentMethod,
    });

    await newPurchase.save();
    res.status(201).json({ message: 'Purchase successful', purchase: newPurchase });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createPurchase;
