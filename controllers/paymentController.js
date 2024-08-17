// controllers/paymentController.js

const stripe = require('../config/stripe');
const Order = require('../models/Order');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, totalAmount, shippingAddress } = req.body;
    
    // Create a new order in the database
    const newOrder = new Order({
      user: req.user.id, // Assuming you have user authentication
      products: cartItems,
      totalAmount,
      shippingAddress
    });
    await newOrder.save();

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price * 100, // Stripe expects amount in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })

  }
};

exports.paymentSuccess = (req, res) => {
  res.render('pages/success');
};

exports.paymentCancel = (req, res) => {
  res.render('pages/cancel');
};
