const express = require('express');
const router = express.Router(); // Initialize the router
const Address = require('../Models/adressschema');
const User = require('../Models/usermode');

// POST request to add a new address
router.post('/add-address', async (req, res) => {
  const { user_id, country, state, city, street_address, pincode } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new address
    const newAddress = new Address({
      user_id,
      country,
      state,
      city,
      street_address,
      pincode
    });

    await newAddress.save();
    res.status(201).json({ message: "Address added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding address" });
  }
});

module.exports = router;
