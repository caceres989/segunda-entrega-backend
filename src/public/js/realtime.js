// Archivo realtime.js 
// src/public/js/realtime.js
console.log('✅ realtime.js cargado correctamente');

// Conectar al servidor de WebSockets
const socket = io();

socket.on('connect', () => {
    console.log('🟢 Conectado al servidor WebSocket');
});

socket.on('productAdded', (product) => {
    console.log('📦 Producto agregado:', product);
    addProductToList(product);
});

socket.on('productDeleted', (productId) => {
    console.log('🗑️ Producto eliminado:', productId);
    removeProductFromList(productId);
});

// Manejar envío del formulario
document.getElementById('productForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('📝 Formulario enviado');
    
    const product = {
        title: document.getElementById('title').value,
        code: document.getElementById('code').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        status: document.getElementById('status').checked
    };
    
    console.log('Enviando producto:', product);
    socket.emit('newProduct', product);
    
    // Limpiar formulario
    e.target.reset();
    document.getElementById('status').checked = true;
});

// Manejar clicks en botones eliminar
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-product')) {
        const productId = e.target.getAttribute('data-id');
        console.log('Eliminando producto:', productId);
        
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            socket.emit('deleteProduct', parseInt(productId));
        }
    }
});

function addProductToList(product) {
    const container = document.getElementById('productsContainer');
    if (!container) {
        console.error('❌ No se encontró el contenedor productsContainer');
        return;
    }
    
    const productCard = createProductCard(product);
    container.insertAdjacentHTML('beforeend', productCard);
    console.log('✅ Producto agregado al DOM');
}

function removeProductFromList(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (productCard) {
        productCard.remove();
        console.log('✅ Producto eliminado del DOM');
    }
}

function createProductCard(product) {
    const statusBadge = product.status 
        ? '<span class="badge bg-success mb-2">Disponible</span>'
        : '<span class="badge bg-danger mb-2">No disponible</span>';
    
    return `
        <div class="col-md-4 mb-4 product-card" data-id="${product.id}">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Código: ${product.code}</h6>
                    <p class="card-text">${product.description}</p>
                    <ul class="list-unstyled">
                        <li><strong>Precio:</strong> $${product.price}</li>
                        <li><strong>Categoría:</strong> ${product.category}</li>
                        <li><strong>Stock:</strong> ${product.stock} unidades</li>
                    </ul>
                    ${statusBadge}
                    <button class="btn btn-danger btn-sm w-100 delete-product" data-id="${product.id}">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
}