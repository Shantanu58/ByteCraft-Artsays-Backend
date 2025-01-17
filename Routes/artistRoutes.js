

const express = require("express");
const {deleteartist,artistdetails,findartist,artists,deleatartistproducts,updateartistproducts,artistproducts,AllProducts} = require("../controllers/artistcontroller");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");




module.exports = router;
router.delete('/artists/:id',deleteartist,authMiddleware) 
router.put('/update-artists/:id', authMiddleware, artistdetails);

router.get('/artists/:id',findartist,authMiddleware) 

router.get('/artists',artists)

// Fetch all products of artist and 
router.delete('/products/:productId',deleatartistproducts,authMiddleware)
router.put('/products/:productId', updateartistproducts,authMiddleware)
router.get('/products/artist/:artistId',artistproducts,authMiddleware) 
router.get('/products',AllProducts)

module.exports = router;
