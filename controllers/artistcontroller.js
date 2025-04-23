const express = require('express');
const mongoose=require('mongoose')

const router = express.Router();
const User = require('../Models/usermode'); // Adjust the path as necessary
const Product = require('../Models/Product');




  const artists= async (req, res) => {
    try {
      const artists = await User.find({ userType: 'Artist' });
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching artists', error });
    }
  };

// Fetch a specific artist by ID

  const findartist=async (req, res) => {
  try {
    const artist = await User.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    if (artist.userType !== 'Artist') {
      return res.status(404).json({ message: 'User found but is not an artist' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist', error: error.message });
  }
};

// Edit artist details
const artistdetails = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Add this
    const artist = await User.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    if (artist.userType !== 'Artist') {
      return res.status(404).json({ message: 'User found but is not an artist' });
    }

    // Update the artist's details with the request body
    const updatedArtist = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log("Updated Artist:", updatedArtist); // Add this
    res.json(updatedArtist);
  } catch (error) {
    res.status(500).json({ message: 'Error updating artist', error: error.message });
  }
};


// Delete an artist

  const deleteartist=async (req, res) => {
  try {
    const artist = await User.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    if (artist.userType !== 'Artist') {
      return res.status(404).json({ message: 'User found but is not an artist' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting artist', error: error.message });
  }
};

// API for Product
// Fetch all products

  const AllProducts=async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
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
// PUT: Update product by productId

  const updateartistproducts=async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedData = req.body;

    // Check if productId is a valid ObjectId and cast it if necessary
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId }, // Use _id instead of productId if it's an ObjectId field
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating the product', error });
  }
};

// DELETE: Delete product by productId

const deleatartistproducts=async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if productId is a valid ObjectId and cast it if necessary
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the product', error });
  }
};

module.exports={deleteartist,artistdetails,findartist,artists,AllProducts,artistproducts, updateartistproducts ,deleatartistproducts}



