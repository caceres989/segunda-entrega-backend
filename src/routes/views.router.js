const express = require('express');
const ProductManager = require('../models/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    console.log('Home - Productos:', products); // Agrega este console.log
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    console.log('RealTime - Productos:', products); // Agrega este console.log
    res.render('realTimeProducts', { products });
});

module.exports = router;