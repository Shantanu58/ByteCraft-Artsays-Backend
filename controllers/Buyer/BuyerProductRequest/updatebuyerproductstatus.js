const ProductStatus = require("../../../Models/CropImage");

const updateProductStatusById = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 

        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Valid options are 'Approved', 'Rejected', or 'Pending'.",
            });
        }

        const updatedProductStatus = await ProductStatus.findByIdAndUpdate(
            id,
            { $set: { status: status, updatedAt: Date.now() } }, 
            { new: true } 
        );

        if (!updatedProductStatus) {
            return res.status(404).json({
                message: "No product status found with the provided ID.",
            });
        }

        res.status(200).json({
            message: "Product status updated successfully",
            updatedProductStatus,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating the product status",
            error: error.message,
        });
    }
};

module.exports = updateProductStatusById;
