// const BuyerRequest = require("../../../Models/Buyercustomrequest");
// const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");

// const createBuyerRequest = async (req, res) => {
//     try {
//         const { error } = buyerRequestValidator.validate(req.body);
//         if (error) return res.status(400).json({ message: error.details[0].message });

//         const { ProductName, Description, RequestStatus, Budget, Artist } = req.body;
//         const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;
//         const BuyerId = req.userID;

    
//         const artistId = typeof Artist === 'string' ? { id: Artist } : Artist;

//         const newBuyerRequest = new BuyerRequest({
//             ProductName,
//             Description,
//             BuyerImage,
//             RequestStatus,
//             Budget,
//             Artist: artistId, 
//             Buyer: { id: BuyerId },
//         });

//         await newBuyerRequest.save();

//         res.status(201).json({
//             message: "Buyer request created successfully",
//             buyerRequest: newBuyerRequest,
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Error creating buyer request",
//             error: error.message,
//         });
//     }
// };

// module.exports = createBuyerRequest;

const BuyerRequest = require("../../../Models/Buyercustomrequest");
const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");

const createBuyerRequest = async (req, res) => {
    try {
 
        const { error } = buyerRequestValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: error.details[0].message 
            });
        }

   
        const { 
            ProductName, 
            Description, 
            ArtType, 
            Size, 
            ColourPreferences, 
            IsFramed, 
            MinBudget, 
            MaxBudget, 
            PaymentTerm, 
            ExpectedDeadline, 
            Comments,
            Artist 
        } = req.body;


        const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;
        
        if (!BuyerImage) {
            return res.status(400).json({ 
                message: "Reference image is required" 
            });
        }

        const BuyerId = req.userID;
        const artistId = typeof Artist === 'string' ? { id: Artist } : Artist;

      
        const newBuyerRequest = new BuyerRequest({
            ProductName,
            Description,
            BuyerImage,
            ArtType,
            Size,
            ColourPreferences: JSON.parse(ColourPreferences),
            IsFramed,
            MinBudget: parseFloat(MinBudget),
            MaxBudget: parseFloat(MaxBudget),
            PaymentTerm,
            ExpectedDeadline: parseInt(ExpectedDeadline),
            Comments,
            Artist: artistId,
            Buyer: { 
                id: BuyerId,
           
            },
            RequestStatus: 'Pending', 
        });

        // Validate budget range
        if (newBuyerRequest.MaxBudget <= newBuyerRequest.MinBudget) {
            return res.status(400).json({ 
                message: "Maximum budget must be greater than minimum budget" 
            });
        }

        await newBuyerRequest.save();

        res.status(201).json({
            message: "Buyer request created successfully",
            buyerRequest: newBuyerRequest,
        });
    } catch (error) {
        console.error("Error creating buyer request:", error);
        res.status(500).json({
            message: "Error creating buyer request",
            error: error.message,
        });
    }
};

module.exports = createBuyerRequest;