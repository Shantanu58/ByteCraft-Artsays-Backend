const express = require('express');

const router = express.Router();
const authenticateToken = require('../Middlewares/authMiddleware');

const multer = require('multer');
const { uploadProduct, artistproducts,upadteproduct,deleteproduct,allproducts,getproductbyid} = require('../controllers/productController');



 
// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products'); // specify your desired path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage, limits: { files: 5 } });
 
// Route to upload a new product
router.post('/upload', authenticateToken, upload.array('images', 5), uploadProduct);   //route to uploade product 
 
router.get('/products/artist/:artistId', artistproducts)//rout to get product by the artists 

 
router.put('/products/:productId', upadteproduct)//rout to deleat the products 

 
router.delete('/products/:productId', deleteproduct)// rout to deleat the products 

 
router.get('/products',allproducts) //rout to get all the products 

 
router.get("/getproductsone/:id",getproductbyid) //rout to get the products by id

 
 
 
 
module.exports = router;
 
