
const BuyerRequest = require("../../../Models/Buyercustomrequest");

const updateRequestStatusByRequestId = async (req, res) => {
    try {
        const requestId = req.params.requestId; 
        const { requestStatus } = req.body; 

        if (!['Approved', 'Rejected', 'Pending'].includes(requestStatus)) {
            return res.status(400).json({
                message: "Invalid request status. Valid options are 'Approved', 'Rejected', or 'Pending'.",
            });
        }

        const updatedRequest = await BuyerRequest.findByIdAndUpdate(
            requestId,
            { $set: { RequestStatus: requestStatus } }, 
            { new: true } 
        );

        if (!updatedRequest) {
            return res.status(404).json({
                message: "No buyer request found with the provided request ID.",
            });
        }

        res.status(200).json({
            message: "Request status updated successfully",
            updatedRequest,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating the request status",
            error: error.message,
        });
    }
};

module.exports = updateRequestStatusByRequestId;



