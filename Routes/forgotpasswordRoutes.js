const express = require("express");
const router = express.Router();


const {
   createotp,
   verifyotp,
   resetpassword
 } = require("../controllers/Email/index");



router.post("/createotp",createotp);
router.post("/verifyotp",verifyotp);
router.post("/resetpassword",resetpassword);


module.exports = router;
