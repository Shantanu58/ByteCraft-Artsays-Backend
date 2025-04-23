const Bidding = require('../../../Models/bidding');

const getAllBids = async (req, res) => {
  try {
    const bids = await Bidding.find()
      .populate('user', 'name email profilePhoto') 
      .populate('product', 'productName price mainImage'); 

    return res.status(200).json({
      message: 'Bids retrieved successfully',
      bids,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllBids;
