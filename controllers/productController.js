
const mongoose = require('mongoose');
const User = require('../Models/usermode'); // Adjust the path as necessary
const Product = require('../Models/Product');
const { v4: uuidv4 } = require('uuid'); // For generating unique product IDs

// Upload Product
const uploadProduct = async (req, res) => {
  const { productName, newPrice, oldPrice, size, description, paintedBy } = req.body;
  const userId = req.user.userId; // ID from token payload after authentication middleware
  const userRole = req.user.role; // role from token payload

  const allowedRoles = ['super-admin', 'admin', 'artist']; // roles allowed to add products

  // Check if the user has permission to upload a product
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "You do not have permission to upload a product." });
  }  

  // Check if there are between 1 and 5 images
  if (!req.files || req.files.length < 1 || req.files.length > 5) {
    return res.status(400).json({ message: "Please upload between 1 to 5 images." });
  }

  const imagePaths = req.files.map(file => file.path); // Assuming `file.path` holds the image path

  const newProduct = new Product({
    artistId: userId, // Set the artistId to the logged-in user's ID
    uploadedBy: {
      id: userId,
      role: userRole,
    },
    productId: uuidv4(),
    images: imagePaths,
    productName,
    newPrice,
    oldPrice,
    size,
    description,
    paintedBy,
  });

  try {
    // Start a session for transaction
    const session = await Product.startSession();
    session.startTransaction();

    // Save the product
    await newProduct.save({ session });

    // Update the user's products list with the new product ID
    await User.findByIdAndUpdate(
      userId,
      { $push: { products: newProduct._id } },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Product uploaded successfully", product: newProduct });
  } catch (error) {
    console.error("Error uploading product:", error.message);

    // Rollback transaction in case of an error
    await session.abortTransaction();
    session.endSession();

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
