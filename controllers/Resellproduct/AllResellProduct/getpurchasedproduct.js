const Purchase = require('../../../Models/BuyerProductPurchased'); 

const getPurchaseDetails = async (req, res) => {
    try {
        const { buyerId } = req.params;

        const purchases = await Purchase.find({ buyer: buyerId })
            .populate({
                path: 'buyer',
                select: 'name lastName email phone',
                match: { role: 'buyer' }
            })
            .populate('product', 'productName price category description mainImage otherImages')
            .populate('resellProduct', 'productName price category description mainImage otherImages');

        const filteredPurchases = purchases.filter(purchase => purchase.buyer);

        res.status(200).json({ purchases: filteredPurchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getPurchaseDetails;
