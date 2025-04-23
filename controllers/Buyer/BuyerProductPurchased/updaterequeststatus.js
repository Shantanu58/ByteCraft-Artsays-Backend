// const BuyerResellProduct = require('../../../Models/BuyerResellProductrequest');

// const updateBuyerResellProductStatus = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { status } = req.body;

    
//     const validStatuses = ['Pending', 'Approved', 'Rejected'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Allowed values: Pending, Approved, Rejected',
//       });
//     }


//     const updatedProduct = await BuyerResellProduct.findByIdAndUpdate(
//       productId,
//       { status },
//       { new: true } 
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Status updated successfully',
//       product: updatedProduct,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = updateBuyerResellProductStatus;

const BuyerResellProduct = require("../../../Models/BuyerResellProductrequest");
const CropImage = require("../../../Models/CropImage");

const updateProductStatus = async (req, res) => {
    try {
        const { id, type } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed values: Pending, Approved, Rejected",
            });
        }

        let updatedProduct;
        let Model;

        if (type === "buyerResell") {
            Model = BuyerResellProduct;
        } else if (type === "cropImage") {
            Model = CropImage;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid type. Allowed values: buyerResell, cropImage",
            });
        }

        updatedProduct = await Model.findByIdAndUpdate(
            id,
            { $set: { status: status, updatedAt: Date.now() } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating product status",
            error: error.message,
        });
    }
};

module.exports = updateProductStatus;
