const ProductRequest = require("../../../Models/CropImage");

const deleteProductRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProductRequest = await ProductRequest.findByIdAndDelete(id);

        if (!deletedProductRequest) {
            return res.status(404).json({
                message: "Product request not found",
            });
        }

        res.status(200).json({
            message: "Product request deleted successfully",
            deletedProductRequest,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting product request",
            error: error.message,
        });
    }
};

module.exports = deleteProductRequest;
