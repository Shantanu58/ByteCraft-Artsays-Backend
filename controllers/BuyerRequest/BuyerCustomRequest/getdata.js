const BuyerRequest = require("../../../Models/Buyercustomrequest");

const getBuyerRequestsByUserId = async (req, res) => {
    try {
        const BuyerId = req.userID;

        const buyerRequests = await BuyerRequest.find({ "Buyer.id": BuyerId })
            .populate("Buyer.id", "name profilePhoto lastName phone email")
            .populate("Artist.id", "name profilePhoto lastName phone email"); 

        if (buyerRequests.length === 0) {
            return res.status(404).json({
                message: "No buyer requests found for this user",
            });
        }

        res.status(200).json({
            message: "Buyer requests fetched successfully",
            buyerRequests,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching buyer requests",
            error: error.message,
        });
    }
};

module.exports = getBuyerRequestsByUserId;
