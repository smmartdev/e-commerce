// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multerMiddleware = require('../config/multiMulter');

// Routes for product management
router.get('/add', productController.showAddProductPage);
router.post('/add', productController.createProductId, multerMiddleware(3,'images','images/users'),productController.completeAddProduct )
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
