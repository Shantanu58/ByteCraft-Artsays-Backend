const Purchase = require('../../../Models/BuyerProductPurchased');
const User = require('../../../Models/usermode');

const getPurchaseDetails = async (req, res) => {
    try {
        // Fetch users with roles 'artist' and 'seller'
        const artistUsers = await User.find({ role: 'artist' }).select('_id');
        const sellerUsers = await User.find({ role: 'seller' }).select('_id');

        const artistUserIds = artistUsers.map(user => user._id);
        const sellerUserIds = sellerUsers.map(user => user._id);

   
        const purchases = await Purchase.find()
            .populate('buyer', 'name lastName email phone')
            .populate({
                path: 'product',
                match: { userId: { $in: [...artistUserIds, ...sellerUserIds] } }, 
                select: 'productName price category description mainImage otherImages userId',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name lastName',
                },
            })
            .populate({
                path: 'resellProduct',
                select: 'productName price category description mainImage otherImages buyerId',
                populate: {
                    path: 'buyerId',
                    model: 'User',
                    select: 'name lastName',
                },
            });

     
        const filteredPurchases = purchases.filter(purchase => purchase.product !== null || purchase.resellProduct !== null);

        res.status(200).json({ purchases: filteredPurchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getPurchaseDetails;
