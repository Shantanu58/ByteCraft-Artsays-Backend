const Purchase = require('../../../Models/BuyerProductPurchased');
const User = require('../../../Models/usermode');

const getPurchaseDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || userId === 'undefined') {
            return res.status(400).json({ message: 'userId is required and cannot be undefined' }); 
        }

        const purchases = await Purchase.find()
            .populate('buyer', 'name lastName email phone')
            .populate({
                path: 'product',
                match: { userId: userId },
                select: 'productName price category description mainImage otherImages userId',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name lastName',
                },
            });

        const filteredPurchases = purchases.filter(purchase => purchase.product !== null);

        res.status(200).json({ purchases: filteredPurchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getPurchaseDetails;
