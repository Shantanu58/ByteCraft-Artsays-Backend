const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/Multerfile/BuyerRequestUplaodMiddlware"); 
const authMiddleware = require("../Middlewares/authMiddleware");
const { createBuyerRequest,
    getBuyerrequest,
    deleterequestdata,
    updatebuyerrequest,
    getBuyerrequestdata,
    updateRequestStatusByBuyerId
 } = require("../controllers/BuyerRequest/index");

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
router.put("/update-request-status/:requestId", updateRequestStatusByBuyerId);

module.exports = router;
