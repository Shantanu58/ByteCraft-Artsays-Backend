// Routes/shippingRoutes.js
const express = require('express');
const router = express.Router();
const ShippingDetails = require('../Models/shippingDetailsModel'); // Adjust the path as necessary
const User = require('../Models/usermode'); // Ensure you import the User model
const Address = require('../Models/adressschema'); // Ensure you import the Address model

// POST request to create new shipping details
// POST request to create new shipping details
router.post('/create-shipping', async (req, res) => {
    const { user_id, transaction_id, address_id } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the address exists
        const address = await Address.findById(address_id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Create new shipping details
        const shippingDetails = new ShippingDetails({
            user_id,
            transaction_id,
            address_id,
            shop_address: "Shop Address Here", // Replace with actual shop address or fetch from a config
        });

        await shippingDetails.save();

        // Populate the address details in the response
        const populatedShippingDetails = await ShippingDetails.findById(shippingDetails._id)
            .populate('address_id');

        res.status(201).json({
            message: "Shipping details created successfully",
            shippingDetails: populatedShippingDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating shipping details" });
    }
});




// GET request to retrieve shipping details by ID
router.get('/:id', async (req, res) => {
    try {
        // Find the shipping details by ID and populate the address and user data
        const shippingDetails = await ShippingDetails.findById(req.params.id)
            .populate({
                path: 'address_id', // Populate the address_id with full address data
                select: 'country state city street_address pincode' // Select the address fields you want to display
            })
            .populate('user_id'); // Optionally populate user details if needed

        if (!shippingDetails) {
            return res.status(404).json({ message: "Shipping details not found" });
        }

        res.json(shippingDetails); // Return the shipping details with populated address data
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching shipping details" });
    }
});



// Export the router
module.exports = router;
