const BuyerRequest = require("../../../Models/Buyercustomrequest");
const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");

const createBuyerRequest = async (req, res) => {
    try {
        const { error } = buyerRequestValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { ProductName, Description, RequestStatus } = req.body;
        const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;  
        const BuyerId = req.userID;  

        console.log("BuyerId:", BuyerId);  

        const newBuyerRequest = new BuyerRequest({
            ProductName,
            Description,
            BuyerImage,
            RequestStatus,
            Buyer: { id: BuyerId },
        });

        await newBuyerRequest.save();

        res.status(201).json({
            message: "Buyer request created successfully",
            buyerRequest: newBuyerRequest,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating buyer request",
            error: error.message,
        });
    }
};



 
module.exports = createBuyerRequest;
