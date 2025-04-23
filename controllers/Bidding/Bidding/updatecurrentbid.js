const Bidding = require('../../../Models/bidding');

const updateBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { currentBid, status } = req.body;

    if (!bidId) {
      return res.status(400).json({ message: 'Bid ID is required' });
    }

    const bid = await Bidding.findById(bidId);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    if (status === 'Ended') {
      bid.status = 'Ended';
      bid.endBid = bid.currentBid;
      await bid.save();

      return res.status(200).json({
        message: 'Bid status updated to ended',
        bid,
      });
    }

    if (currentBid !== undefined) {
      if (bid.currentBid !== null && currentBid <= bid.currentBid) {
        return res.status(400).json({ message: 'Current bid must be higher than the previous bid' });
      }

      bid.currentBid = currentBid;

      if (bid.status === 'Pending') {
        bid.status = 'Active';
      }

      await bid.save();

      return res.status(200).json({
        message: 'Bid updated successfully',
        bid,
      });
    }

    return res.status(400).json({ message: 'No valid update fields provided' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateBid;
