// src/controllers/productController.js
const ProductManager = require('../models/ProductManager'); // Verifica que esta ruta sea correcta

class ProductController {
    constructor() {
        this.productManager = new ProductManager(); // Aquí debe funcionar
    }

    async getAllProducts(req, res) {
        const products = await this.productManager.getProducts();
        res.json({ success: true, products });
    }

    async addProduct(req, res) {
        const result = await this.productManager.addProduct(req.body);
        if (result.success) {
            req.io.emit('productAdded', result.product);
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    }

    async deleteProduct(req, res) {
        const result = await this.productManager.deleteProduct(req.params.pid);
        if (result.success) {
            req.io.emit('productDeleted', parseInt(req.params.pid));
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    }
}

module.exports = ProductController;