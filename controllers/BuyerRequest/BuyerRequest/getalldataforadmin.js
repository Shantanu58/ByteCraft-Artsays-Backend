const BuyerRequest = require("../../../Models/Buyercustomrequest");

const getAllRequests = async (req, res) => {
    try {
      
        const buyerRequests = await BuyerRequest.find()
            .populate("Buyer.id", "name profilePhoto lastName phone email -_id")  
            .populate("Artist.id", "name profilePhoto lastName phone email -_id"); 

        if (buyerRequests.length === 0) {
            return res.status(404).json({
                message: "No buyer or artist requests found",
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

module.exports=getAllRequests
