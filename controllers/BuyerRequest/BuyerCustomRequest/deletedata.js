const BuyerRequest = require("../../../Models/Buyercustomrequest");

const deleteBuyerRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBuyerRequest = await BuyerRequest.findByIdAndDelete(id);

        if (!deletedBuyerRequest) {
            return res.status(404).json({
                message: "Buyer request not found",
            });
        }

        res.status(200).json({
            message: "Buyer request deleted successfully",
            deletedBuyerRequest,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting buyer request",
            error: error.message,
        });
    }
};

module.exports = deleteBuyerRequest ;
