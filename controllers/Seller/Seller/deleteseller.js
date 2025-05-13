const User = require('../../../Models/usermode');

const deleteSeller = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findOneAndDelete({ _id: userId, role: 'seller' });
  
      if (!user) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = deleteSeller;
