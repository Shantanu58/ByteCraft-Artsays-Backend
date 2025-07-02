const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/Multerfile/BuyerRequestUplaodMiddlware"); 
const authMiddleware = require("../Middlewares/authMiddleware");
const { createBuyerRequest,
    getBuyerrequest,
    deleterequestdata,
    updatebuyerrequest,
    getBuyerrequestdata,
    updateRequestStatusByBuyerId,
    NegiotaiteBudgetupdate,
    getalldataforadmin,
    NegiotaiteBuyerupdate,
    getdatabybuyerid
 } = require("../controllers/BuyerRequest/index");
 const updateBuyerStatus = require("../controllers/BuyerRequest/BuyerRequest/updateBuyerStatus");

const uploadFiles = (req, res, next) => {
    upload.fields([
      { name: "BuyerImage", maxCount: 1 },
    
    ])(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };

router.post("/buyer-request", authMiddleware, uploadFiles, createBuyerRequest);
router.put("/update-buyer-request/:id", authMiddleware, uploadFiles, updatebuyerrequest);
router.get("/get-buyer-request", authMiddleware,  getBuyerrequest);
router.delete("/delete-buyer-requests/:id", deleterequestdata);
router.get("/get-buyer-request-data", authMiddleware,getBuyerrequestdata);
router.put("/update-request-status/:requestId",authMiddleware, updateRequestStatusByBuyerId);
router.put("/update-negiotaite-budget/:id",authMiddleware, NegiotaiteBudgetupdate);
router.get("/get-data-admin",authMiddleware,getalldataforadmin)
router.get("/get-data-adminbyid/:buyerId",authMiddleware,getdatabybuyerid)
router.put("/update-negiotaite-Buyer-budget/:id",authMiddleware, NegiotaiteBuyerupdate)







router.put('/buyer-request-buyer-status/:id',authMiddleware, updateBuyerStatus);



module.exports = router;
