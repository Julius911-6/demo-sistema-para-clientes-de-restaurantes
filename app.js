// Datos de productos de El Sabroso
const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Pollo Entero', price: 45.00, stock: 20, emoji: '🍗' },
    { id: 2, name: 'Pechuga (kg)', price: 38.00, stock: 30, emoji: '🍗' },
    { id: 3, name: 'Piernas (kg)', price: 32.00, stock: 25, emoji: '🦵' },
    { id: 4, name: 'Alitas (kg)', price: 28.00, stock: 40, emoji: '🍖' },
    { id: 5, name: 'Combo Familiar', price: 120.00, stock: 15, emoji: '👨‍👩‍👧‍👦' },
    { id: 6, name: 'Arepa con Queso', price: 8.00, stock: 50, emoji: '🫓' },
    { id: 7, name: 'Tostones', price: 10.00, stock: 45, emoji: '🍟' },
    { id: 8, name: 'Ensalada', price: 12.00, stock: 35, emoji: '🥗' },
    { id: 9, name: 'Bebida Refr. (L)', price: 5.00, stock: 100, emoji: '🥤' },
    { id: 10, name: 'Jugo Natural (L)', price: 7.00, stock: 60, emoji: '🧃' },
];

let cart = [];
let products = [];
let sales = [];
let initialCash = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderProducts();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
    
    // Establecer fecha actual en reportes
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reportFrom').value = today;
    document.getElementById('reportTo').value = today;
});

// Cargar datos del localStorage
function loadData() {
    const saved = localStorage.getItem('posData');
    if (saved) {
        const data = JSON.parse(saved);
        products = data.products || DEFAULT_PRODUCTS;
        sales = data.sales || [];
        initialCash = data.initialCash || 0;
    } else {
        products = DEFAULT_PRODUCTS;
        updateStorage();
    }
    document.getElementById('initialCash').textContent = formatCurrency(initialCash);
}

// Guardar datos en localStorage
function updateStorage() {
    const data = {
        products: products,
        sales: sales,
        initialCash: initialCash,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('posData', JSON.stringify(data));
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.section).classList.add('active');
            
            if (this.dataset.section === 'reportes') {
                updateReports();
            }
        });
    });

    // Carrito
    document.getElementById('discount').addEventListener('change', updateCartTotal);
    document.getElementById('completeSale').addEventListener('click', completeSale);
    document.getElementById('clearCart').addEventListener('click', clearCart);

    // Inventario
    document.getElementById('btnAddProduct').addEventListener('click', openProductModal);
    const modal = document.getElementById('productModal');
    document.querySelector('.close').addEventListener('click', closeProductModal);
    document.getElementById('productForm').addEventListener('submit', addProduct);

    // Reportes
    document.getElementById('generateReport').addEventListener('click', updateReports);

    // Configuración
    document.getElementById('setCashBtn').addEventListener('click', setCashInitial);
    document.getElementById('exportData').addEventListener('click', exportData);
    document.getElementById('importData').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', importData);
    document.getElementById('resetDay').addEventListener('click', resetDay);
}

// Renderizar productos
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-stock">Stock: ${product.stock}</div>
            </div>
        `;
        card.addEventListener('click', () => addToCart(product));
        grid.appendChild(card);
    });
}

// Agregar al carrito
function addToCart(product) {
    if (product.stock <= 0) {
        showToast('Sin stock disponible', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showToast('Sin stock suficiente', 'error');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            emoji: product.emoji
        });
    }
    updateCart();
}

// Actualizar vista del carrito
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Carrito vacío</p>';
    } else {
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-qty">
                    <button onclick="decreaseQty(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQty(${item.id})">+</button>
                </div>
                <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
            `;
            cartItems.appendChild(itemEl);
        });
    }
    updateCartTotal();
}

// Aumentar cantidad
function increaseQty(productId) {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);
    if (item && item.quantity < product.stock) {
        item.quantity++;
        updateCart();
    }
}

// Disminuir cantidad
function decreaseQty(productId) {
    const item = cart.find(i => i.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
    } else {
        removeFromCart(productId);
    }
}

// Remover del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Actualizar total del carrito
function updateCartTotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('total').textContent = formatCurrency(total);
}

// Completar venta
function completeSale() {
    if (cart.length === 0) {
        showToast('El carrito está vacío', 'error');
        return;
    }
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        // Reducir stock
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    const sale = {
        id: Date.now(),
        items: [...cart],
        subtotal: subtotal,
        discount: discount,
        discountAmount: discountAmount,
        total: total,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString()
    };
    
    sales.push(sale);
    updateStorage();
    showToast(`✓ Venta completada - Total: ${formatCurrency(total)}`, 'success');
    
    cart = [];
    document.getElementById('discount').value = '0';
    updateCart();
    renderProducts();
}

// Limpiar carrito
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('¿Limpiar el carrito?')) {
        cart = [];
        document.getElementById('discount').value = '0';
        updateCart();
    }
}

// Modal de producto
function openProductModal() {
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
}

function addProduct(e) {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    
    if (!name || !price || !stock) {
        showToast('Completar todos los campos', 'error');
        return;
    }
    
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: name,
        price: price,
        stock: stock,
        emoji: '🍗'
    };
    
    products.push(newProduct);
    updateStorage();
    renderProducts();
    renderInventory();
    showToast(`Producto "${name}" agregado`, 'success');
    closeProductModal();
}

// Inventario
function renderInventory() {
    const tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.emoji} ${product.name}</td>
            <td>${product.stock}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatCurrency(product.price * product.stock)}</td>
            <td>
                <button class="btn-secondary" onclick="editStock(${product.id})">Editar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editStock(productId) {
    const product = products.find(p => p.id === productId);
    const newStock = prompt(`Nuevo stock para ${product.name} (actual: ${product.stock}):`, product.stock);
    if (newStock !== null && !isNaN(newStock)) {
        product.stock = parseInt(newStock);
        updateStorage();
        renderProducts();
        renderInventory();
        showToast('Stock actualizado', 'success');
    }
}

// Reportes
function updateReports() {
    const from = new Date(document.getElementById('reportFrom').value);
    const to = new Date(document.getElementById('reportTo').value);
    to.setHours(23, 59, 59, 999);
    
    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.timestamp);
        return saleDate >= from && saleDate <= to;
    });
    
    let totalSales = 0;
    let totalTransactions = filteredSales.length;
    const paymentBreakdown = { efectivo: 0, tarjeta: 0, transferencia: 0 };
    const productSalesCount = {};
    
    filteredSales.forEach(sale => {
        totalSales += sale.total;
        paymentBreakdown[sale.paymentMethod] = (paymentBreakdown[sale.paymentMethod] || 0) + sale.total;
        
        sale.items.forEach(item => {
            productSalesCount[item.id] = (productSalesCount[item.id] || 0) + item.quantity;
        });
    });
    
    const avgTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    document.getElementById('totalSales').textContent = formatCurrency(totalSales);
    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('avgTicket').textContent = formatCurrency(avgTicket);
    
    // Métodos de pago
    const paymentHTML = Object.entries(paymentBreakdown)
        .filter(([, amount]) => amount > 0)
        .map(([method, amount]) => `<div class="stat"><span class="label" style="text-transform: capitalize;">${method}:</span><span class="value">${formatCurrency(amount)}</span></div>`)
        .join('');
    document.getElementById('paymentBreakdown').innerHTML = paymentHTML || '<p style="color: #999;">Sin ventas</p>';
    
    // Top productos
    const topProducts = Object.entries(productSalesCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => {
            const product = products.find(p => p.id == id);
            return `<div class="stat"><span class="label">${product.emoji} ${product.name}</span><span class="value">${count}</span></div>`;
        })
        .join('');
    document.getElementById('topProducts').innerHTML = topProducts || '<p style="color: #999;">Sin ventas</p>';
    
    // Historial
    const historyHTML = filteredSales.reverse().map(sale => `
        <tr>
            <td>${new Date(sale.timestamp).toLocaleTimeString()}</td>
            <td>${sale.items.map(i => `${i.emoji} ${i.quantity}x`).join(', ')}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td style="text-transform: capitalize;">${sale.paymentMethod}</td>
        </tr>
    `).join('');
    document.getElementById('salesHistory').innerHTML = historyHTML || '<tr><td colspan="4" style="text-align: center; color: #999; padding: 20px;">Sin ventas</td></tr>';
}

// Configuración
function setCashInitial() {
    const value = parseFloat(document.getElementById('setCash').value);
    if (isNaN(value) || value < 0) {
        showToast('Valor inválido', 'error');
        return;
    }
    initialCash = value;
    updateStorage();
    document.getElementById('initialCash').textContent = formatCurrency(initialCash);
    document.getElementById('setCash').value = '';
    showToast('Saldo inicial establecido', 'success');
}

function exportData() {
    const data = {
        exportDate: new Date().toISOString(),
        products: products,
        sales: sales,
        initialCash: initialCash
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `el-sabroso-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Datos exportados', 'success');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if (confirm('¿Reemplazar todos los datos con el archivo importado?')) {
                products = data.products || DEFAULT_PRODUCTS;
                sales = data.sales || [];
                initialCash = data.initialCash || 0;
                updateStorage();
                renderProducts();
                renderInventory();
                showToast('Datos importados exitosamente', 'success');
            }
        } catch (error) {
            showToast('Error al importar archivo', 'error');
        }
    };
    reader.readAsText(file);
}

function resetDay() {
    if (confirm('⚠️ ¿Vaciar la caja y resetear el día? Esto no se puede deshacer.')) {
        sales = [];
        cart = [];
        initialCash = 0;
        updateStorage();
        document.getElementById('initialCash').textContent = formatCurrency(0);
        updateCart();
        showToast('Sistema reseteado', 'success');
    }
}

// Utilidades
function formatCurrency(value) {
    return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES'
    }).format(value);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateClock() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleString('es-VE');
}
