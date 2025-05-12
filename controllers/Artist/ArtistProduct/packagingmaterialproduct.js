const Purchase = require('../../../Models/Packagingmaterialpurchased');
const User = require('../../../Models/usermode');

const getAllPurchases = async (req, res) => {
    try {
       
        const artists = await User.find({ role: 'artist' }).select('_id');

        if (!artists.length) {
            return res.status(404).json({ message: 'No artists found' });
        }

        const artistIds = artists.map(artist => artist._id);

      
        const purchases = await Purchase.find({ user: { $in: artistIds } })
            .populate('user', 'name lastName email phone') 
            .populate('product', 'productName price category description mainImage otherImages') 
            .populate({
                path: 'product',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name lastName'
                }
            });

        res.status(200).json({ purchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getAllPurchases;
