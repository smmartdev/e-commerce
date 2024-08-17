// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route for handling checkout
router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.get('/success', paymentController.paymentSuccess);
router.get('/cancel', paymentController.paymentCancel);

module.exports = router;
