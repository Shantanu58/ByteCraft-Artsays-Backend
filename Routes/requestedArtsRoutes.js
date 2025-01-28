// Routes/requestedArtsRoutes.js
const express = require('express');
const router = express.Router();
const RequestedArts = require('../Models/RequestedArts'); // The requested arts model
const User = require('../Models/usermode'); // Assuming you have a User model

// Route to request a custom painting
router.post('/request-art', async (req, res) => {
  const { userId, artistId, description, attributes, askingPrice, discountedPrice, finalPrice } = req.body;

  try {
    // Check if the user and artist exist
    const user = await User.findById(userId);
    const artist = await User.findById(artistId);

    if (!user || !artist) {
      return res.status(404).json({ message: 'User or artist not found' });
    }

    // Create a new requested art entry
    const requestedArt = new RequestedArts({
      userId,
      artistId,
      description,
      attributes,
      askingPrice,
      discountedPrice,
      finalPrice
    });

    // Save the requested art
    await requestedArt.save();
    res.status(201).json({ message: 'Custom art request created successfully', requestedArt });
  } catch (error) {
    res.status(500).json({ message: 'Error creating custom art request', error });
  }
});

// Route to get all custom painting requests for a buyer
router.get('/buyer-requests/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await RequestedArts.find({ userId }).populate('artistId', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});

// Route to get all custom painting requests for an artist
router.get('/artist-requests/:artistId', async (req, res) => {
  const { artistId } = req.params;

  try {
    const requests = await RequestedArts.find({ artistId }).populate('userId', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});

module.exports = router;
