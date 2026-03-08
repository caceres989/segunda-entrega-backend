// src/models/ProductManager.js
const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../../productos.json');
        this.products = [];
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
            await this.saveProducts();
        }
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    async addProduct(product) {
        await this.loadProducts();
        
        const newProduct = {
            id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
            title: product.title,
            description: product.description,
            price: parseFloat(product.price),
            code: product.code,
            stock: parseInt(product.stock),
            category: product.category,
            status: true,
            thumbnail: []
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return { success: true, product: newProduct };
    }

    async deleteProduct(id) {
        await this.loadProducts();
        const index = this.products.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) {
            return { success: false, error: 'Producto no encontrado' };
        }

        this.products.splice(index, 1);
        await this.saveProducts();
        return { success: true };
    }
}

// VERIFICA QUE ESTA LÍNEA ESTÉ AL FINAL
module.exports = ProductManager;