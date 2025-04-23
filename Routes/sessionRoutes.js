const express = require("express");
const router = express.Router();

const trackSession = require("../Middlewares/Session");
const {
    getsession
 } = require("../controllers/Session/index");




router.get("/getsession",trackSession,getsession);


module.exports = router;
