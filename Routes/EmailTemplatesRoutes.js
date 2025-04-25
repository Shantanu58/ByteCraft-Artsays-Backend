// routes/blogRoutes.js
const express = require("express");
const {
    createOrUpdateNewUser,
    getContent,
     createOrUpdateNewSeller,
      getContentNewSeller,
      createOrUpdateNewBuyer,
      getContentNewBuyer,
  } = require("../controllers/Templates/index");
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/save-template", authMiddleware, createOrUpdateNewUser);
router.get("/get-template", authMiddleware, getContent);
router.post("/save-template-new-seller", authMiddleware, createOrUpdateNewSeller);
router.get("/get-template-new-seller", authMiddleware, getContentNewSeller);
router.post("/save-template-new-buyer", authMiddleware, createOrUpdateNewBuyer);
router.get("/get-template-new-buyer", authMiddleware, getContentNewBuyer);

module.exports = router;
