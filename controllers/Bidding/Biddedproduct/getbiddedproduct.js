const BiddedProduct = require('../../../Models/biddedproduct');

const getBiddedProducts = async (req, res) => {
    try {
        const biddedProducts = await BiddedProduct.find()
            .populate('buyer', 'name lastName email phone')
            .populate({
                path: 'product',
                select: 'startingBid currentBid endBid status',
                populate: [
                    {
                        path: 'user',
                        model: 'User',
                        select: 'name lastName'
                    },
                    {
                        path: 'product',
                        model: 'Product',
                        select: 'productName price category description mainImage otherImages'
                    }
                ]
            });

        res.status(200).json({ success: true, biddedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = getBiddedProducts;
