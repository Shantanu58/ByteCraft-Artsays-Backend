const BuyerRequest = require("../../../Models/Buyercustomrequest");

const updateBuyerRequestByBuyerId = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { ProductName, Description, NegiotaiteBudget, MaxBudget, MinBudget, BuyerNotes,  rejectedcomment, BuyerStatus } = req.body;

        const existingRequest = await BuyerRequest.findById(requestId);

        if (!existingRequest) {
            return res.status(404).json({
                message: "No buyer request found with the provided ID.",
            });
        }

        let updateFields = {  rejectedcomment, BuyerStatus };

 
        if (ProductName || Description || NegiotaiteBudget || MaxBudget || MinBudget || BuyerNotes) {
            if (existingRequest.updateCount >= 2) {
                return res.status(400).json({
                    message: "This buyer request has already been updated and cannot be updated again.",
                });
            }

            updateFields = {
                ...updateFields,
                ProductName,
                Description,
                NegiotaiteBudget,
                MaxBudget,
                MinBudget,
                BuyerNotes,
            };
        }

        const updatedRequest = await BuyerRequest.findByIdAndUpdate(
            requestId,
            {
                $set: updateFields,
                ...(Object.keys(updateFields).some(field => 
                    ["ProductName", "Description", "NegiotaiteBudget", "MaxBudget", "MinBudget", "BuyerNotes"].includes(field)
                ) && { $inc: { updateCount: 1 } }),
            },
            { new: true }
        );

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
