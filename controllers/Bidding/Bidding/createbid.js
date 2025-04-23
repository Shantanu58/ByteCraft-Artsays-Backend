const Bidding = require('../../../Models/bidding');

const createBid = async (req, res) => {
  try {
    const { user, product, startingBid } = req.body;


    if (!user || !product || !startingBid) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBid = new Bidding({
      user,
      product,
      startingBid,
      currentBid: null,
      endBid: null,
      status: 'Pending',
    });

    const savedBid = await newBid.save();

    return res.status(201).json({
      message: 'Bid created successfully',
      bid: savedBid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = createBid;
