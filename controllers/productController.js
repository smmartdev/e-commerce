// controllers/productController.js

const Product = require('../models/Product');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// const mongoose = require('mongoose');

exports.showAddProductPage = async (req, res) => {
  console.log('showAddProductPage');
  try {
    const properties = req.properties;
    res.render('pages/product_add', { properties });
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.completeAddProduct = async (req, res) => {
  console.log('completeAddProduct called');
  try {
    const { name, description, price, category } = req.body;
    const sellerId = req.properties.userId;
    const user = await User.findById(sellerId);
    const sellerName = user.name;
    const productId = req.productId;


    if (!user) {
      throw new Error('Seller not found');
    }
    const updatedProduct = await Product.findOneAndUpdate({ _id: productId }, {
      name,
      description,
      price,
      category,
      sellerId,
      sellerName
    });

    if (!updatedProduct) {
      throw new Error('Error while updating product data');
    }

    // res.status(200).json({
    //   message: 'Images uploaded successfully!',
    //   files: req.files.map(file => file.filename) // Map file objects to filenames
    // });
    res.redirect('/products');

    res.render()
  } catch (error) {
    res.render('pages/404', { error });
  }
};

exports.createProductId = async (req, res, next) => {
  console.log('createProductId called');
  try {
    const newProduct = new Product({
      name: ' ',
      description: '',
      price: 0,
      category: '',
      sellerId: ' ',
      sellerName: ' '
    });

    const savedProduct = await newProduct.save();
    if (!savedProduct) {
      throw new Error('Error while creating empty product');
    }

    const directoryPath = path.join(__dirname, '../public/images/products-images', `${savedProduct._id}`);
    fs.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) {
        throw new Error('Files or filenames are missing.', err);
      }
    });

    const destinationPath = `public/images/products-images/${savedProduct._id}`
    req.productId = savedProduct._id;
    req.destinationPath = destinationPath;
    req.maxCount = 3;
    req.imageFields = 'images';

    next();
  } catch (error) {
    res.render('pages/404', { error });
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
  console.log('deleteProduct called');
  try {
    console.log('req.params.id: ', req.params.id);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new Error('Product not found');
    res.redirect('/products?deleteStatus=ok');
  } catch (error) {
    // res.status(500).json({ error: error.message });
    res.render('pages/404', { error })
  }
};
