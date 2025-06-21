const Purchase = require('../../../Models/BuyerProductPurchased');

const getPurchaseDetails = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate('buyer', 'name lastName email phone')
            .populate('product', 'productName price category description mainImage otherImages')
            .populate('resellProduct', 'productName price category description mainImage otherImages')
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

module.exports = getPurchaseDetails;
