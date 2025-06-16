const mongoose = require('mongoose');
const Purchase = require('../../../Models/BuyerProductPurchased');

const getTotalQuantityPurchasedByUser = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId); 

        const purchaseQuantity = await Purchase.aggregate([
            {
                $group: {
                    _id: "$product",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "crops",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "productDetails.userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $match: {
                    "userDetails.userType": "Seller",
                    "userDetails._id": userId 
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    userId: "$userDetails._id",
                    artistName: { $concat: ["$userDetails.name", " ", "$userDetails.lastName"] },
                    productName: "$productDetails.productName",
                    productPrice: "$productDetails.price",
                    product: "$productDetails.mainImage",
                    totalQuantity: 1
                }
            }
        ]);

        res.status(200).json(purchaseQuantity);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = getTotalQuantityPurchasedByUser;
