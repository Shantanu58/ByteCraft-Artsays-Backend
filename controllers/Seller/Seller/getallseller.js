const User = require('../../../Models/usermode');

const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' });

    if (sellers.length === 0) {
      return res.status(404).json({ message: 'No sellers found' });
    }

    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getAllSellers;
