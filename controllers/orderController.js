// controllers/orderController.js

const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })

  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json(orders);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })

  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })

  }
};
