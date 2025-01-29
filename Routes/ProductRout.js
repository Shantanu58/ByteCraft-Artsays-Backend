const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middlewares/authMiddleware');
const multer = require('multer');
const { uploadProduct, artistproducts, upadteproduct, deleteproduct, allproducts, getproductbyid } = require('../controllers/productController');

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
    cb(null, true);
  },
});

const logRequestData = (req, res, next) => {
  console.log('Received form data:');
  console.log(req.body);
  console.log('Received files:');
  console.log(req.files);
  console.log('Main Image:');
  console.log(req.files.mainImage);
  console.log('Images:');
  console.log(req.files.images);
  next();
};

// Route to upload a new product
router.post('/upload', authenticateToken, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 4 }]),logRequestData, uploadProduct);

// Route to get products by artist
router.get('/products/artist/:artistId', artistproducts);

// Route to update a product
router.put('/products/:productId', upadteproduct);

// Route to delete a product
router.delete('/products/:productId', deleteproduct);

// Route to get all products
router.get('/products', allproducts);

// Route to get a product by ID
router.get("/getproductsone/:id", getproductbyid);

module.exports = router;
