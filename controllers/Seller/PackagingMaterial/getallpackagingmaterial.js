const Purchase = require('../../../Models/Packagingmaterialpurchased');
const User = require('../../../Models/usermode');

const getAllPurchases = async (req, res) => {
    try {
     
        const sellers = await User.find({ role: 'seller' }).select('_id');

        if (!sellers.length) {
            return res.status(404).json({ message: 'No sellers found' });
        }

        const sellerIds = sellers.map(seller => seller._id); 

       
        const purchases = await Purchase.find({ user: { $in: sellerIds } })
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
