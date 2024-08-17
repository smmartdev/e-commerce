// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route for viewing the cart
router.get('/', cartController.viewCart);

// Route for adding items to the cart
router.post('/add/:productId', cartController.addToCart);

// Route for removing items from the cart
router.post('/remove', cartController.removeFromCart);

module.exports = router;

//get'/cart'
//post'/cart/add' userId, productId, quantity, price
//post'/cart/remove'
