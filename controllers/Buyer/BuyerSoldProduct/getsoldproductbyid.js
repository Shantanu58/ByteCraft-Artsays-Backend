const mongoose = require('mongoose');
const Purchase = require('../../../Models/BuyerProductPurchased');

const getTotalQuantityPurchased = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from request parameters

        const purchaseQuantity = await Purchase.aggregate([
            {
                $match: { resellProduct: { $ne: null } }
            },
            {
                $group: {
                    _id: "$resellProduct",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "buyerresellproducts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "users",
                    localField: "productDetails.buyerId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },

            {
                $match: { "userDetails._id": new mongoose.Types.ObjectId(userId) } // Filter by userId
            },

            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    userId: "$userDetails._id",
                    buyerName: { 
                        $concat: ["$userDetails.name", " ", "$userDetails.lastName"]
                    },
                    productName: "$productDetails.productName",
                    productPrice: "$productDetails.price",
                    product: "$productDetails.mainImage",
                    totalQuantity: 1
                }
            }
        ]);

        res.status(200).json(purchaseQuantity || []);
    } catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = getTotalQuantityPurchased;
