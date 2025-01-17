const User = require('../Models/usermode');

// Get details of all buyers
const getAllBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ role: 'buyer' }) // Assuming 'role' indicates the type of user
      .populate('wishlist')
      .populate('cart.product')
      .populate('orders');

    if (buyers.length === 0) {
      return res.status(404).json({ message: 'No buyers found' });
    }

    res.status(200).json(buyers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get buyer details
const getBuyer = async (req, res) => {
  try {
    const buyer = await User.findOne({ _id: req.params.userId, role: 'buyer' })
      .populate('wishlist')
      .populate('cart.product')
      .populate('orders');

    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update buyer
const updateBuyer = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, wishlist, cart } = req.body;

    // Update user details
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, wishlist, cart },
      { new: true }
    );

    if (!user || user.role !== 'buyer') {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    res.status(200).json({ message: 'Buyer updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete buyer
const deleteBuyer = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user record
    const user = await User.findOneAndDelete({ _id: userId, role: 'buyer' });

    if (!user) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    res.status(200).json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllBuyers,
  
  getBuyer,
  updateBuyer,
  deleteBuyer,
};
