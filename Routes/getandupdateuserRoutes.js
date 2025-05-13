const express = require('express');

const { 
    getUserById,
    // changePassword ,
    updateuserprofile,
    deleteUserById,
    updateartistdetails,
    getartistdetails,
    updateSocialLinks,
    updateBankDetails,
    getBankDetails,
    updateartwork,
    getartwork,
    updategreements,
    getagreements,
    updateverification,
    getverification,
    updatebuyerPreferences,
    getbuyerPreferences,
    updatebuisnessprodfile,
    getbusinessprofile,
    updatesellartwork,
    getsellartwork,
    updateTaxLegalCompliance,
    getTaxLegalCompliance,
    updatestatus
} = require('../controllers/getandupdateotheruser');
const { uploadMiddleware
 } = require('../Middlewares/uploadMiddleware'); 
 const upload = require("../Middlewares/Multerfile/verification");
 const uploadtax = require("../Middlewares/Multerfile/taxandlegal");
const router = express.Router();


router.get('/getartistdetails/:userId', getartistdetails);
router.get('/userid/:id', getUserById);
router.put('/users/:id', uploadMiddleware, updateuserprofile);
// router.put('/users/:id/change-password', changePassword);
router.delete('/users/:id', deleteUserById);
router.put('/updateartistdetails/:userId', updateartistdetails);
router.put('/updatesociallink/:userId', updateSocialLinks);
router.put('/updatebankdetails/:userId', updateBankDetails);
router.get('/bankdetails/:userId', getBankDetails);

router.put('/updateartworkdetails/:userId', updateartwork);
router.get('/artworkdetails/:userId', getartwork);
router.put('/updateagreementdetails/:userId',updategreements)
router.get('/agreementdetails/:userId',getagreements)
router.put("/updateverificationdetails/:userId", upload.single("file"),updateverification)
router.get("/verificationdetails/:userId", upload.single("file"),getverification)

router.put('/updatepreferences/:userId',updatebuyerPreferences)
router.get('/getpreferences/:userId',getbuyerPreferences)

router.put('/updatebusinessprofile/:userId',updatebuisnessprodfile)
router.get('/getbusinessprofile/:userId',getbusinessprofile)

router.put('/updatesellartwork/:userId',updatesellartwork)
router.get('/getsellartwork/:userId',getsellartwork)

router.put("/updatetaxlegalcompliance/:userId", uploadtax,updateTaxLegalCompliance)
router.get("/gettaxlegalcompliance/:userId", uploadtax,getTaxLegalCompliance)

router.put("/updateuserstatus/:id",updatestatus)

module.exports = router;

