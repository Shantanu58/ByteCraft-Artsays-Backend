const BuyerRequest = require("../../../Models/Buyercustomrequest");

const getRequestsByBuyer = async (req, res) => {
    try {
        const { buyerId } = req.params;  

        const buyerRequests = await BuyerRequest.find({ "Buyer.id": buyerId })
            .populate("Buyer.id", "name profilePhoto lastName phone email -_id")
            .populate("Artist.id", "name profilePhoto lastName phone email -_id");

        if (buyerRequests.length === 0) {
            return res.status(404).json({
                message: "No requests found for the specified buyer",
            });
        }

        res.status(200).json({
            message: "Buyer and artist requests fetched successfully",
            buyerRequests,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching buyer and artist requests",
            error: error.message,
        });
    }
};

module.exports = getRequestsByBuyer;
