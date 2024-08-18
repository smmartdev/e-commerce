// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const User = require('../models/User')
const Product = require('../models/Product')
const multerMiddleware = require('../config/multer');

// Routes for product management
router.get('/add', productController.showAddProductPage);
router.post('/add', productController.createProductId, multerMiddleware(),productController.completeAddProduct )
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
