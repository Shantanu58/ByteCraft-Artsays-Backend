
const mongoose = require('mongoose');
const User = require('../Models/usermode'); // Adjust the path as necessary
const Product = require('../Models/Product');
const { v4: uuidv4 } = require('uuid'); // For generating unique product IDs

const uploadProduct = async (req, res) => {
  console.log("Request Headers:", req.headers);
  console.log("Request Body (raw):", req.body); // Log the raw body
  console.log("Parsed Form Data:", req.body); // Assuming multer or similar parses it
  const { productName, newPrice, oldPrice, size, description } = req.body;
  const userId = req.user.userId;
  const userRole = req.user.role;

  const allowedRoles = ['super-admin', 'admin', 'artist'];

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "You do not have permission to upload a product." });
  }

  // Check if the main image is provided
  if (!req.files || !req.files.mainImage) {
    return res.status(400).json({ message: "Please upload a main image." });
  }

  const mainImage = req.files.mainImage[0]; // Access the main image

  // Check if additional images are provided
  const additionalImages = req.files.images || []; // Access additional images

  // Validate required fields
  if (!productName || !newPrice || !size || !description ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newProduct = new Product({
    artistId: userId,
    uploadedBy: {
      id: userId,
      role: userRole,
    },
    productId: uuidv4(),
    mainImage: mainImage.path, // Main image path
    images: additionalImages.map(file => file.path), // Array of additional image paths
    productName,
    newPrice,
    oldPrice,
    size,
    description,

  });

  let session = null;

  try {
    // Start a MongoDB session
    session = await Product.startSession();
    session.startTransaction();

    // Save the new product
    await newProduct.save({ session });

    // Update the user's product list
    await User.findByIdAndUpdate(
      userId,
      { $push: { products: newProduct._id } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Product uploaded successfully", product: newProduct });
  } catch (error) {
    console.error("Error uploading product:", error.message);

    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    res.status(500).json({ message: "Error uploading product", error: error.message });
  }
};




const artistproducts=async (req, res) => {
  try {
    const artistId = new mongoose.Types.ObjectId(req.params.artistId); // Corrected line, using 'new'
 
    // Find products where artistId matches
    const products = await Product.find({ artistId: artistId });
 
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this artist' });
    }
    res.json(products); // Return the products
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching products for the artist', error });
  }
};




const upadteproduct=async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const updatedData = req.body; // Expecting the updated product data in the request body
 
    // Update the product based on productId
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
 
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct); // Return the updated product
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error updating the product', error });
  }
};

const deleteproduct=async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
 
    // Delete the product based on productId
    const deletedProduct = await Product.findByIdAndDelete(productId);
 
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' }); // Confirm deletion
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting the product', error });
  }
};

const allproducts= async (req, res) => {
  try {
   
    // Find products where artistId matches
    const products = await Product.find();
 
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this artist' });
    }
   return res.json(products); // Return the products
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching products for the artist', error });
    
  }
};


const getproductbyid= async (req, res) => {
 
  try {
      const { id } = req.params;
      console.log(id);
 
      const individual = await Product.findOne({ id: id });
      console.log(individual + "ind mila hai");
 
      res.status(201).json(individual);
  } catch (error) {
      res.status(400).json(error);
  }
};
module.exports = { uploadProduct,artistproducts,upadteproduct,deleteproduct,allproducts,getproductbyid };
