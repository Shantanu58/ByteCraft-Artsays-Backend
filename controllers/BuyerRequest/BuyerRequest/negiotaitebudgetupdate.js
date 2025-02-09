const BuyerRequest = require("../../../Models/Buyercustomrequest");

const updateBuyerRequestByBuyerId = async (req, res) => {
    try {
        const requestId = req.params.id; 
        const { ProductName, Description, Budget, NegiotaiteBudget, Notes } = req.body;

        if (!ProductName || !Description || !Budget || !NegiotaiteBudget || !Notes) {
            return res.status(400).json({
                message: "ProductName, Description, Budget, NegiotaiteBudget, and Notes are required.",
            });
        }

        const updatedRequest = await BuyerRequest.findByIdAndUpdate(
            requestId,  
            { $set: { ProductName, Description, Budget, NegiotaiteBudget, Notes } },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                message: "No buyer request found with the provided ID.",
            });
        }

        res.status(200).json({
            message: "Buyer request updated successfully",
            updatedRequest,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating the buyer request",
            error: error.message,
        });
    }
};

module.exports = updateBuyerRequestByBuyerId;
