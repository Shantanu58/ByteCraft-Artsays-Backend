const Purchase = require('../../../Models/Packagingmaterialpurchased');
const User = require('../../../Models/usermode');

const getAllPurchases = async (req, res) => {
    try {
     
        const buyers = await User.find({ role: 'buyer' }).select('_id');

        if (!buyers.length) {
            return res.status(404).json({ message: 'No buyers found' });
        }

        const buyerIds = buyers.map(buyer => buyer._id); 

       
        const purchases = await Purchase.find({ user: { $in: buyerIds } })
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
