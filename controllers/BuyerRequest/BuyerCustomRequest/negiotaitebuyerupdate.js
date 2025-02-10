const BuyerRequest = require("../../../Models/Buyercustomrequest");

const updateBuyerRequestByBuyerId = async (req, res) => {
    try {
        const requestId = req.params.id; 
        const { ProductName, Description, Budget, NegiotaiteBudget, BuyerNotes } = req.body;

   
        if (!ProductName || !Description || !Budget || !NegiotaiteBudget || !BuyerNotes) {
            return res.status(400).json({
                message: "ProductName, Description, Budget, NegiotaiteBudget, and BuyerNotes are required.",
            });
        }

   
        const existingRequest = await BuyerRequest.findById(requestId);

        if (!existingRequest) {
            return res.status(404).json({
                message: "No buyer request found with the provided ID.",
            });
        }

  
        if (existingRequest.isUpdated) {
            return res.status(400).json({
                message: "This buyer request has already been updated and cannot be updated again.",
            });
        }

      
        const updatedRequest = await BuyerRequest.findByIdAndUpdate(
            requestId,
            { 
                $set: { 
                    ProductName, 
                    Description, 
                    Budget, 
                    NegiotaiteBudget, 
                    BuyerNotes,
                    isUpdated: true  
                }
            },
            { new: true }
        );

        res.status(200).json({
            message: "Buyer request updated successfully",
            updatedRequest,
        });
    } catch (error) {
    
        if (error.message.includes("Cannot update repeat")) {
            return res.status(400).json({
                message: "This buyer request has already been updated and cannot be updated again.",
            });
        }
        
    
        res.status(500).json({
            message: "Error updating the buyer request",
            error: error.message,
        });
    }
};

module.exports = updateBuyerRequestByBuyerId;
