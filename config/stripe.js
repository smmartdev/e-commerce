// config/stripeConfig.js

const Stripe = require('stripe');
const stripe = Stripe('your_stripe_secret_key'); // Replace with your Stripe secret key

module.exports = stripe;
