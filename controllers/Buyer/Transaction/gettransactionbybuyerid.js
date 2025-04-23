const Purchase = require('../../../Models/BuyerProductPurchased');

const getPurchaseDetailsByBuyerId = async (req, res) => {
    try {
        const { buyerId } = req.params; 

        const purchases = await Purchase.find()
            .populate('buyer', 'name lastName email phone')
            .populate({
                path: 'resellProduct',
                select: 'productName price category description mainImage otherImages buyerId',
                populate: {
                    path: 'buyerId',
                    select: 'name lastName',
                },
            });


        const filteredPurchases = purchases.filter(purchase => 
            purchase.resellProduct && purchase.resellProduct.buyerId?._id.toString() === buyerId
        );

        res.status(200).json({ purchases: filteredPurchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getPurchaseDetailsByBuyerId;
