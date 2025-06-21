const BiddedProduct = require('../../../Models/biddedproduct');

const getBiddedProducts = async (req, res) => {
    try {
        const { buyerId } = req.params; 

        if (!buyerId) {
            return res.status(400).json({ success: false, message: "Buyer ID is required" });
        }

        const biddedProducts = await BiddedProduct.find({ buyer: buyerId })
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
                        model: 'Crop',
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
