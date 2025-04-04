// const Purchase = require('../../../Models/BuyerProductPurchased');
// const User = require('../../../Models/usermode');

// const getPurchaseDetails = async (req, res) => {
//     try {
//         // Fetch users with roles 'artist' and 'seller'
//         const artistUsers = await User.find({ role: 'artist' }).select('_id');
//         const sellerUsers = await User.find({ role: 'seller' }).select('_id');

//         const artistUserIds = artistUsers.map(user => user._id);
//         const sellerUserIds = sellerUsers.map(user => user._id);

   
//         const purchases = await Purchase.find()
//             .populate('buyer', 'name lastName email phone')
//             .populate({
//                 path: 'product',
//                 match: { userId: { $in: [...artistUserIds, ...sellerUserIds] } }, 
//                 select: 'productName price category description mainImage otherImages userId',
//                 populate: {
//                     path: 'userId',
//                     model: 'User',
//                     select: 'name lastName',
//                 },
//             })
//             .populate({
//                 path: 'resellProduct',
//                 select: 'productName price category description mainImage otherImages buyerId',
//                 populate: {
//                     path: 'buyerId',
//                     model: 'User',
//                     select: 'name lastName',
//                 },
//             });

     
//         const filteredPurchases = purchases.filter(purchase => purchase.product !== null || purchase.resellProduct !== null);

//         res.status(200).json({ purchases: filteredPurchases });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// module.exports = getPurchaseDetails;

const Purchase = require('../../../Models/BuyerProductPurchased');
const PackagingPurchase = require('../../../Models/Packagingmaterialpurchased');
const BiddedProduct = require('../../../Models/biddedproduct');
const User = require('../../../Models/usermode');

const getAllPurchaseAndBiddedDetails = async (req, res) => {
    try {
     
        const productPurchases = await Purchase.find()
            .populate('buyer', 'name lastName email phone')
            .populate({
                path: 'product',
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

        const filteredProductPurchases = productPurchases.filter(purchase => purchase.product !== null || purchase.resellProduct !== null);

     
        const packagingPurchases = await PackagingPurchase.find({ product: { $exists: true, $ne: null } })
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
                        model: 'Crop',
                        select: 'productName price category description mainImage otherImages'
                    }
                ]
            });

        res.status(200).json({
            success: true,
            productPurchases: filteredProductPurchases,
            packagingPurchases: packagingPurchases,
            biddedProducts: biddedProducts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = getAllPurchaseAndBiddedDetails;

