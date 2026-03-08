// src/routes/products.router.js
const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();
const productController = new ProductController();

// Middleware para pasar io a los controladores
router.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
});

router.get('/', (req, res) => productController.getAllProducts(req, res));
router.post('/', (req, res) => productController.addProduct(req, res));
router.delete('/:pid', (req, res) => productController.deleteProduct(req, res));

module.exports = router;