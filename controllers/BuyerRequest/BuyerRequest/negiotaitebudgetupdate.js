const BuyerRequest = require("../../../Models/Buyercustomrequest");

const updateBuyerRequestByBuyerId = async (req, res) => {
    try {
        const requestId = req.params.id; 
        const { ProductName, Description, MaxBudget, MinBudget, NegotiatedBudget, Notes } = req.body;

  
        if (!ProductName || !Description || !MaxBudget || !MinBudget || !NegotiatedBudget || !Notes) {
            return res.status(400).json({
                message: "ProductName, Description, MaxBudget, MinBudget, NegotiatedBudget, and Notes are required.",
            });
        }

 
        const existingRequest = await BuyerRequest.findById(requestId);

        if (!existingRequest) {
            return res.status(404).json({
                message: "No buyer request found with the provided ID.",
            });
        }

       
        if (existingRequest.updateCount >= 3) {
            return res.status(400).json({
                message: "This buyer request has already been updated two times and cannot be updated again.",
            });
        }


        const newUpdateCount = existingRequest.updateCount + 1;
        let updateFields = {
            ProductName, 
            Description, 
            MaxBudget, 
            MinBudget, 
            NegotiatedBudget, 
            Notes,
            updateCount: newUpdateCount
        };

   
        // if (newUpdateCount === 3) {
        //     updateFields.ApprovedStatus = "Approved";
        // }

        const updatedRequest = await BuyerRequest.findByIdAndUpdate(
            requestId,
            { $set: updateFields },
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
