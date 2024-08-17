// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes for order management
router.post('/create', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;
