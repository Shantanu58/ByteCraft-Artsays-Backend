const BuyerRequest = require("../../../Models/Buyercustomrequest");

const getBuyerRequestsByArtistId = async (req, res) => {
    try {

        const ArtistId = req.userID; 

        const buyerRequests = await BuyerRequest.find({ "Artist.id": ArtistId })
            .populate("Buyer.id", "name profilePhoto lastName phone email")
            .populate("Artist.id", "name profilePhoto lastName phone email");

        if (buyerRequests.length === 0) {
            return res.status(404).json({
                message: "No buyer requests found for this artist",
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

module.exports = getBuyerRequestsByArtistId;

