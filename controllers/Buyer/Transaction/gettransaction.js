const Purchase = require('../../../Models/BuyerProductPurchased');
const User = require('../../../Models/usermode');

const getPurchaseDetails = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate('buyer', 'name lastName email phone')
            .populate({
                path: 'resellProduct',
                select: 'productName price category description mainImage otherImages buyerId',
                populate: {
                    path: 'buyerId',
                    model: 'User',
                    select: 'name lastName',
                },
            });

 
        const filteredPurchases = purchases.filter(purchase => purchase.resellProduct !== null && purchase.resellProduct !== undefined);

        res.status(200).json({ purchases: filteredPurchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getPurchaseDetails;
