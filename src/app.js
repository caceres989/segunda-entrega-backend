const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const productsRouter = require('./routes/products.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    extname: '.handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('io', io);

// Rutas
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// WebSockets
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado');
    
    socket.on('newProduct', async (product) => {
        try {
            const ProductManager = require('./models/ProductManager');
            const pm = new ProductManager();
            const result = await pm.addProduct(product);
            if (result.success) {
                io.emit('productAdded', result.product);
            }
        } catch (error) {
            console.error(error);
        }
    });
    
    socket.on('deleteProduct', async (productId) => {
        try {
            const ProductManager = require('./models/ProductManager');
            const pm = new ProductManager();
            const result = await pm.deleteProduct(productId);
            if (result.success) {
                io.emit('productDeleted', productId);
            }
        } catch (error) {
            console.error(error);
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});