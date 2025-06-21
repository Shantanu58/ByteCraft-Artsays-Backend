const express = require("express");
const {
 getadmin,
 updatecompanyinfo,
 getcomapnyinfo,
 getproduct
} = require("../controllers/Admin/index");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");





router.get('/getadmin',getadmin)
router.put('/updatecompanyinfo/:userId',updatecompanyinfo)
router.get('/getcompanyinfo/:userId',getcomapnyinfo)
router.get('/getproductdetails/:userId',getproduct)

module.exports = router;