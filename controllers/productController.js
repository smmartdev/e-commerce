// controllers/productController.js

const Product = require('../models/Product');
const mongoose = require('mongoose');
exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  console.log('getProducts called');
  try {
    const products = await Product.find();
    const properties = req.properties;
    if (properties.isLogged) {
      console.log('isLogged true');

      res.render('pages/products', { products, properties });
    } else {
      console.log('isLogged false');
      res.render('pages/products', { products, properties });
    }



  } catch (error) {
    console.log('error', error.message);
    res.render('/pages/404', { error });
  }

};

exports.getProduct = async (req, res) => {
  console.log('getProduct called');
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new Error('Product not found');

    const properties = req.properties;


    if (properties.isLogged) {
      console.log('isLogged true');

      res.render('pages/product', { product, properties });
    } else {
      console.log('isLogged false');
      res.render('pages/product', { product, properties });
    }

  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })

  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })

  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })

  }
};
