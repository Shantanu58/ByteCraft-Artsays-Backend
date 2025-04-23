const Purchase = require('../../../Models/Packagingmaterialpurchased');
const User = require('../../../Models/usermode');

const getPackagingPurchaseDetails = async (req, res) => {
    try {
        const purchases = await Purchase.find({ product: { $exists: true, $ne: null } }) 
            .populate('user', 'name lastName email phone') 
            .populate({
                path: 'product',
                select: 'productName price category description mainImage otherImages userId',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name lastName',
                },
            });

        res.status(200).json({ purchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getPackagingPurchaseDetails;
