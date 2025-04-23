const Bidding = require('../../../Models/bidding');

const getAllActiveBids = async (req, res) => {
  try {

    const bids = await Bidding.find({ status: 'Active' }) 
      .populate('user', 'name email profilePhoto')
      .populate('product', 'productName price mainImage'); 

    return res.status(200).json({
      message: 'Active bids retrieved successfully',
      bids,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getAllActiveBids;
