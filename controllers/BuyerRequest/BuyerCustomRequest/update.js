const BuyerRequest = require("../../../Models/Buyercustomrequest");
const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");

const updateBuyerRequest = async (req, res) => {
    try {
        const { error } = buyerRequestValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { ProductName, Description, RequestStatus, Budget, Artist } = req.body;
        const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;
        const BuyerId = req.userID;
        const { id } = req.params;

        const buyerRequest = await BuyerRequest.findById(id);
        if (!buyerRequest) {
            return res.status(404).json({ message: "Buyer request not found" });
        }

        const artistId = typeof Artist === 'string' ? { id: Artist } : Artist;

        if (ProductName) buyerRequest.ProductName = ProductName;
        if (Description) buyerRequest.Description = Description;
        if (RequestStatus) buyerRequest.RequestStatus = RequestStatus;
        if (Budget) buyerRequest.Budget = Budget;
        if (artistId) buyerRequest.Artist = artistId;
        if (BuyerImage) buyerRequest.BuyerImage = BuyerImage;
        buyerRequest.Buyer.id = BuyerId;

        await buyerRequest.save();

        res.status(200).json({
            message: "Buyer request updated successfully",
            buyerRequest,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating buyer request",
            error: error.message,
        });
    }
};

module.exports = updateBuyerRequest;
