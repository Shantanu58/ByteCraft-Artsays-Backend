// const BuyerRequest = require("../../../Models/Buyercustomrequest");
// const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");

// const updateBuyerRequest = async (req, res) => {
//     try {
//         const { error } = buyerRequestValidator.validate(req.body);
//         if (error) return res.status(400).json({ message: error.details[0].message });

//         const { ProductName, Description, RequestStatus, Budget, Artist } = req.body;
//         const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;
//         const BuyerId = req.userID;
//         const { id } = req.params;

//         const buyerRequest = await BuyerRequest.findById(id);
//         if (!buyerRequest) {
//             return res.status(404).json({ message: "Buyer request not found" });
//         }

//         const artistId = typeof Artist === 'string' ? { id: Artist } : Artist;

//         if (ProductName) buyerRequest.ProductName = ProductName;
//         if (Description) buyerRequest.Description = Description;
//         if (RequestStatus) buyerRequest.RequestStatus = RequestStatus;
//         if (Budget) buyerRequest.Budget = Budget;
//         if (artistId) buyerRequest.Artist = artistId;
//         if (BuyerImage) buyerRequest.BuyerImage = BuyerImage;
//         buyerRequest.Buyer.id = BuyerId;

//         await buyerRequest.save();

//         res.status(200).json({
//             message: "Buyer request updated successfully",
//             buyerRequest,
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Error updating buyer request",
//             error: error.message,
//         });
//     }
// };

// module.exports = updateBuyerRequest;

const BuyerRequest = require("../../../Models/Buyercustomrequest");
const buyerRequestValidator = require("../../../Validators/Buysercustomrequestvalidators/BuyerCustomRequestValidator");

const updateBuyerRequest = async (req, res) => {
    try {

        const { error } = buyerRequestValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: error.details.map(detail => detail.message).join(', ') 
            });
        }

        const { id } = req.params;
        const BuyerId = req.userID;
        

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
            Artist,
            RequestStatus,
            NegotiatedBudget,
            ArtistNotes,
            BuyerNotes
        } = req.body;

 
        const BuyerImage = req.files && req.files.BuyerImage ? req.files.BuyerImage[0].path : null;

    
        const buyerRequest = await BuyerRequest.findById(id);
        if (!buyerRequest) {
            return res.status(404).json({ message: "Buyer request not found" });
        }

     
        if (buyerRequest.Buyer.id.toString() !== BuyerId) {
            return res.status(403).json({ message: "Unauthorized to update this request" });
        }

      
        const artistId = typeof Artist === 'string' ? { id: Artist } : Artist;
        const colours = ColourPreferences ? JSON.parse(ColourPreferences) : undefined;


        if (MinBudget && MaxBudget && parseFloat(MaxBudget) <= parseFloat(MinBudget)) {
            return res.status(400).json({ 
                message: "Maximum budget must be greater than minimum budget" 
            });
        }

   
        const updateFields = {
            ProductName: ProductName || buyerRequest.ProductName,
            Description: Description || buyerRequest.Description,
            ArtType: ArtType || buyerRequest.ArtType,
            Size: Size || buyerRequest.Size,
            ColourPreferences: colours || buyerRequest.ColourPreferences,
            IsFramed: IsFramed !== undefined ? IsFramed : buyerRequest.IsFramed,
            MinBudget: MinBudget ? parseFloat(MinBudget) : buyerRequest.MinBudget,
            MaxBudget: MaxBudget ? parseFloat(MaxBudget) : buyerRequest.MaxBudget,
            PaymentTerm: PaymentTerm || buyerRequest.PaymentTerm,
            ExpectedDeadline: ExpectedDeadline ? parseInt(ExpectedDeadline) : buyerRequest.ExpectedDeadline,
            Comments: Comments !== undefined ? Comments : buyerRequest.Comments,
            Artist: artistId || buyerRequest.Artist,
            BuyerImage: BuyerImage || buyerRequest.BuyerImage,
            RequestStatus: RequestStatus || buyerRequest.RequestStatus,
            NegotiatedBudget: NegotiatedBudget ? parseFloat(NegotiatedBudget) : buyerRequest.NegotiatedBudget,
            ArtistNotes: ArtistNotes !== undefined ? ArtistNotes : buyerRequest.ArtistNotes,
            BuyerNotes: BuyerNotes !== undefined ? BuyerNotes : buyerRequest.BuyerNotes,
            isUpdated: true,
            $inc: { updateCount: 1 }
        };

    
        Object.assign(buyerRequest, updateFields);
        
        
        const updatedRequest = await buyerRequest.save();

        res.status(200).json({
            message: "Buyer request updated successfully",
            buyerRequest: updatedRequest,
            changes: updateFields
        });
    } catch (error) {
        console.error("Error updating buyer request:", error);
        res.status(500).json({
            message: "Error updating buyer request",
            error: error.message,
        });
    }
};

module.exports = updateBuyerRequest;
