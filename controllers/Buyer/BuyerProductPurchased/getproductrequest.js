// const BuyerResellProduct = require('../../../Models/BuyerResellProductrequest');

// const getBuyerResellProducts = async (req, res) => {
//   try {
//     const products = await BuyerResellProduct.find()
//       .populate('buyerId', 'name lastName'); 

//     res.status(200).json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = getBuyerResellProducts;

const BuyerResellProduct = require('../../../Models/BuyerResellProductrequest');
const Crop = require('../../../Models/CropImage');
const User = require('../../../Models/usermode');

const getCombinedData = async (req, res) => {
  try {
  
    const buyers = await User.find({ userType: 'Buyer' }).select('_id name lastName profilePhoto email website');

    if (buyers.length === 0) {
      return res.status(404).json({ message: 'No buyers found' });
    }

    const buyerIds = buyers.map(buyer => buyer._id);

 
    const products = await BuyerResellProduct.find({ buyerId: { $in: buyerIds } })
      .populate('buyerId', 'name lastName');

  
    const crops = await Crop.find({ userId: { $in: buyerIds } })
      .populate('userId', 'name lastName profilePhoto email website');

    if (products.length === 0 && crops.length === 0) {
      return res.status(404).json({ message: 'No products or crops found for buyers' });
    }

    res.status(200).json({
      success: true,
      message: 'Data fetched successfully',
      data: {
        products,
        crops,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message,
    });
  }
};

module.exports = getCombinedData;


