const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders } = require('../controllers/OrderController');

// Route to create an order
router.post('/create-order', createOrder);

// Route to get all orders for a specific user
router.get('/user-orders/:user_id', getUserOrders);

module.exports = router;
