// app.js - Versión mejorada
let compradores = JSON.parse(localStorage.getItem('compradores')) || [];
let productos = JSON.parse(localStorage.getItem('productos')) || [];
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
let reporteActual = null;

// Sistema de notificaciones Toast
function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast show ${tipo}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Formato de moneda
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(valor);
}

function guardarDatos() {
    localStorage.setItem('compradores', JSON.stringify(compradores));
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

function actualizarListas() {
    // Actualizar datalist de compradores
    const compradoresList = document.getElementById('compradoresList');
    compradoresList.innerHTML = '';
    compradores.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        compradoresList.appendChild(option);
    });

    // Actualizar datalist de productos
    const productosList = document.getElementById('productosList');
    productosList.innerHTML = '';
    productos.forEach(p => {
        const option = document.createElement('option');
        option.value = p.nombre;
        productosList.appendChild(option);
    });

    // Actualizar lista de compradores en búsqueda
    const listaCompradores = document.getElementById('listaCompradores');
    listaCompradores.innerHTML = '';
    compradores.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        li.onclick = () => document.getElementById('comprador').value = c;
        listaCompradores.appendChild(li);
    });

    // Actualizar lista de todos los compradores con botón eliminar
    const listaTodosCompradores = document.getElementById('listaTodosCompradores');
    listaTodosCompradores.innerHTML = '';
    compradores.forEach((c, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="item-name">${c}</span>
            <button class="btn-delete" onclick="eliminarComprador(${index})">🗑️ Eliminar</button>
        `;
        listaTodosCompradores.appendChild(li);
    });

    // Actualizar lista de productos con botón eliminar
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = '';
    productos.forEach((p, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">${p.nombre}</span>
                <span class="item-price">${formatearMoneda(p.valor)}</span>
            </div>
            <button class="btn-delete" onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
        `;
        listaProductos.appendChild(li);
    });
    
    // Actualizar contadores
    document.getElementById('productosCount').textContent = productos.length;
    document.getElementById('compradoresCount').textContent = compradores.length;
    
    // Actualizar historial de ventas (últimas 5)
    actualizarHistorialVentas();
}

// Actualizar historial de ventas recientes
function actualizarHistorialVentas() {
    const listaHistorial = document.getElementById('listaHistorialVentas');
    listaHistorial.innerHTML = '';
    
    const ultimasVentas = ventas.slice(-5).reverse();
    
    if (ultimasVentas.length === 0) {
        listaHistorial.innerHTML = '<li style="text-align:center; color:#999;">No hay ventas registradas</li>';
        return;
    }
    
    ultimasVentas.forEach(v => {
        const li = document.createElement('li');
        const fecha = new Date(v.fecha);
        li.innerHTML = `
            <strong>${v.comprador}</strong> - ${v.producto}<br>
            <span class="item-price">${formatearMoneda(v.valor)}</span> | ${v.metodo}<br>
            <span class="venta-fecha">${fecha.toLocaleString('es-CL')}</span>
        `;
        listaHistorial.appendChild(li);
    });
}

// Filtrar compradores en búsqueda
document.getElementById('buscarComprador').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const lista = document.getElementById('listaCompradores');
    lista.innerHTML = '';
    compradores.filter(c => c.toLowerCase().includes(term)).forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        li.onclick = () => document.getElementById('comprador').value = c;
        lista.appendChild(li);
    });
});

// Autorelleno de valor al seleccionar producto
document.getElementById('producto').addEventListener('input', (e) => {
    const valorInput = document.getElementById('valor');
    const productoSeleccionado = e.target.value.trim();
    const prodExistente = productos.find(p => p.nombre.toLowerCase() === productoSeleccionado.toLowerCase());
    if (prodExistente) {
        valorInput.value = prodExistente.valor;
    } else {
        valorInput.value = ''; // Limpiar si no existe
    }
});

// Formulario de nueva venta
document.getElementById('ventaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const comprador = document.getElementById('comprador').value.trim();
    const producto = document.getElementById('producto').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);
    const metodo = document.getElementById('metodo').value;
    
    // Agregar comprador si no existe
    if (!compradores.includes(comprador) && comprador) {
        compradores.push(comprador);
    }
    
    // Buscar precio de producto si existe (usar el autorellenado)
    const prodExistente = productos.find(p => p.nombre.toLowerCase() === producto.toLowerCase());
    const precioFinal = prodExistente ? prodExistente.valor : valor;
    
    // Agregar producto si no existe
    if (!prodExistente && producto) {
        productos.push({ nombre: producto, valor: precioFinal });
    }
    
    ventas.push({
        comprador,
        producto,
        valor: precioFinal,
        metodo,
        fecha: new Date().toISOString()
    });
    
    guardarDatos();
    actualizarListas();
    actualizarPendientes();
    mostrarToast('✅ Venta registrada exitosamente', 'success');
    e.target.reset();
});

// Formulario de nuevo producto
document.getElementById('productoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nuevoProducto').value.trim();
    const valor = parseFloat(document.getElementById('valorProducto').value);
    
    if (!productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
        productos.push({ nombre, valor });
        guardarDatos();
        actualizarListas();
        mostrarToast('✅ Producto agregado exitosamente', 'success');
        e.target.reset();
    } else {
        mostrarToast('⚠️ El producto ya existe', 'error');
    }
});

// Formulario de nuevo comprador
document.getElementById('compradorForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nuevoComprador').value.trim();
    
    if (!compradores.includes(nombre)) {
        compradores.push(nombre);
        guardarDatos();
        actualizarListas();
        mostrarToast('✅ Comprador agregado exitosamente', 'success');
        e.target.reset();
    } else {
        mostrarToast('⚠️ El comprador ya existe', 'error');
    }
});

// Funciones para eliminar items
function eliminarProducto(index) {
    if (confirm(`¿Eliminar el producto "${productos[index].nombre}"?`)) {
        productos.splice(index, 1);
        guardarDatos();
        actualizarListas();
        mostrarToast('🗑️ Producto eliminado', 'info');
    }
}

function eliminarComprador(index) {
    if (confirm(`¿Eliminar el comprador "${compradores[index]}"?`)) {
        compradores.splice(index, 1);
        guardarDatos();
        actualizarListas();
        mostrarToast('🗑️ Comprador eliminado', 'info');
    }
}

// Mostrar secciones con actualización de botones activos
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // Actualizar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === id) {
            btn.classList.add('active');
        }
    });
}

// Generar reportes con totales por tipo de pago
function generarReporte(tipo) {
    const ahora = new Date();
    let inicio;
    let ventasFiltradas;
    
    if (tipo === 'diario') {
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        ventasFiltradas = ventas.filter(v => new Date(v.fecha) >= inicio);
    } else if (tipo === 'semanal') {
        inicio = new Date(ahora);
        inicio.setDate(ahora.getDate() - ahora.getDay());
        ventasFiltradas = ventas.filter(v => new Date(v.fecha) >= inicio);
    } else if (tipo === 'mensual') {
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        ventasFiltradas = ventas.filter(v => new Date(v.fecha) >= inicio);
    } else if (tipo === 'todo') {
        ventasFiltradas = ventas;
    }
    
    reporteActual = { tipo, ventas: ventasFiltradas };
    
    if (ventasFiltradas.length === 0) {
        document.getElementById('reporteContenido').innerHTML = '<p style="text-align:center; color:#999; padding:2em;">No hay ventas en este período</p>';
        document.getElementById('exportarBtn').style.display = 'none';
        return;
    }
    
    let html = `<h3>📊 Reporte ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>`;
    html += `<p style="color:#666; margin-bottom:1em;">Total de ventas: ${ventasFiltradas.length}</p>`;
    html += '<ul>';
    
    let totalGeneral = 0;
    const totalesPorPago = { efectivo: 0, transferencia: 0, pendiente: 0 };
    
    ventasFiltradas.forEach(v => {
        const fecha = new Date(v.fecha);
        const metodoIcono = v.metodo === 'efectivo' ? '💵' : v.metodo === 'transferencia' ? '💳' : '⏳';
        html += `<li>
            <strong>${v.comprador}</strong> compró <strong>${v.producto}</strong><br>
            ${formatearMoneda(v.valor)} ${metodoIcono} ${v.metodo}<br>
            <span class="venta-fecha">${fecha.toLocaleString('es-CL')}</span>
        </li>`;
        totalGeneral += v.valor;
        totalesPorPago[v.metodo] += v.valor;
    });
    
    html += `</ul><div class="resumen-total">💰 Total General: ${formatearMoneda(totalGeneral)}</div>`;
    
    // Agregar totales por pago
    Object.keys(totalesPorPago).forEach(metodo => {
        if (totalesPorPago[metodo] > 0) {
            const metodoIcono = metodo === 'efectivo' ? '💵' : metodo === 'transferencia' ? '💳' : '⏳';
            const metodoTexto = metodo === 'efectivo' ? 'Efectivo' : metodo === 'transferencia' ? 'Transferencia' : 'Pendiente';
            html += `<div class="resumen-por-pago">${metodoIcono} Total ${metodoTexto}: ${formatearMoneda(totalesPorPago[metodo])}</div>`;
        }
    });
    
    document.getElementById('reporteContenido').innerHTML = html;
    document.getElementById('exportarBtn').style.display = 'block';
}

// Exportar reporte a texto
function exportarReporte() {
    if (!reporteActual || !reporteActual.ventas.length) {
        mostrarToast('⚠️ No hay reporte para exportar', 'error');
        return;
    }
    
    let texto = `REPORTE DE VENTAS - ${reporteActual.tipo.toUpperCase()}\n`;
    texto += `Generado: ${new Date().toLocaleString('es-CL')}\n`;
    texto += `Total de ventas: ${reporteActual.ventas.length}\n`;
    texto += `${'='.repeat(50)}\n\n`;
    
    let totalGeneral = 0;
    const totalesPorPago = { efectivo: 0, transferencia: 0, pendiente: 0 };
    
    reporteActual.ventas.forEach((v, i) => {
        texto += `${i + 1}. ${v.comprador} - ${v.producto}\n`;
        texto += `   Valor: ${formatearMoneda(v.valor)} | Método: ${v.metodo}\n`;
        texto += `   Fecha: ${new Date(v.fecha).toLocaleString('es-CL')}\n\n`;
        totalGeneral += v.valor;
        totalesPorPago[v.metodo] += v.valor;
    });
    
    texto += `${'='.repeat(50)}\n`;
    texto += `TOTAL GENERAL: ${formatearMoneda(totalGeneral)}\n\n`;
    texto += `TOTALES POR MÉTODO DE PAGO:\n`;
    Object.keys(totalesPorPago).forEach(metodo => {
        if (totalesPorPago[metodo] > 0) {
            texto += `- ${metodo.toUpperCase()}: ${formatearMoneda(totalesPorPago[metodo])}\n`;
        }
    });
    
    // Descargar archivo
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_ventas_${reporteActual.tipo}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    mostrarToast('📥 Reporte exportado exitosamente', 'success');
}

// Gestión de Pagos Pendientes
function actualizarPendientes() {
    const ventasPendientes = ventas.filter(v => v.metodo === 'pendiente');
    const listaPendientes = document.getElementById('listaPendientes');
    
    // Actualizar badge de navegación
    const badge = document.getElementById('badgePendientes');
    if (ventasPendientes.length > 0) {
        badge.textContent = ventasPendientes.length;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
    
    // Actualizar estadísticas
    const totalPendiente = ventasPendientes.reduce((sum, v) => sum + v.valor, 0);
    document.getElementById('totalPendiente').textContent = formatearMoneda(totalPendiente);
    document.getElementById('cantidadPendiente').textContent = ventasPendientes.length;
    
    // Mostrar lista
    if (ventasPendientes.length === 0) {
        listaPendientes.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-text">¡No hay pagos pendientes!</div>
            </div>
        `;
        return;
    }
    
    listaPendientes.innerHTML = '';
    ventasPendientes.forEach((venta, index) => {
        const ventaIndex = ventas.indexOf(venta);
        const fecha = new Date(venta.fecha);
        const diasPendiente = Math.floor((new Date() - fecha) / (1000 * 60 * 60 * 24));
        
        const div = document.createElement('div');
        div.className = 'pendiente-item';
        div.innerHTML = `
            <div class="pendiente-header">
                <div class="pendiente-info">
                    <div class="pendiente-comprador">👤 ${venta.comprador}</div>
                    <div class="pendiente-producto">📦 ${venta.producto}</div>
                </div>
                <div class="pendiente-monto">${formatearMoneda(venta.valor)}</div>
            </div>
            <div class="pendiente-footer">
                <div class="pendiente-fecha">
                    📅 ${fecha.toLocaleDateString('es-CL')}
                    ${diasPendiente > 0 ? `<span style="color:#ff9800;">(${diasPendiente} día${diasPendiente !== 1 ? 's' : ''} pendiente)</span>` : ''}
                </div>
                <div class="pendiente-actions">
                    <button class="btn-pagar" onclick="marcarComoPagado(${ventaIndex}, 'efectivo')">💵 Efectivo</button>
                    <button class="btn-pagar" onclick="marcarComoPagado(${ventaIndex}, 'transferencia')">💳 Transferencia</button>
                    <button class="btn-eliminar-venta" onclick="eliminarVenta(${ventaIndex})">🗑️</button>
                </div>
            </div>
        `;
        listaPendientes.appendChild(div);
    });
}

// Marcar venta como pagada
function marcarComoPagado(index, metodoPago) {
    if (index < 0 || index >= ventas.length) return;
    
    const venta = ventas[index];
    const confirmacion = confirm(`¿Marcar como pagado con ${metodoPago}?\n\nComprador: ${venta.comprador}\nProducto: ${venta.producto}\nMonto: ${formatearMoneda(venta.valor)}`);
    
    if (confirmacion) {
        ventas[index].metodo = metodoPago;
        ventas[index].fechaPago = new Date().toISOString();
        guardarDatos();
        actualizarPendientes();
        actualizarHistorialVentas();
        mostrarToast(`✅ Pago registrado: ${formatearMoneda(venta.valor)} en ${metodoPago}`, 'success');
    }
}

// Eliminar venta
function eliminarVenta(index) {
    if (index < 0 || index >= ventas.length) return;
    
    const venta = ventas[index];
    const confirmacion = confirm(`¿Eliminar esta venta?\n\nComprador: ${venta.comprador}\nProducto: ${venta.producto}\nMonto: ${formatearMoneda(venta.valor)}\n\n⚠️ Esta acción no se puede deshacer.`);
    
    if (confirmacion) {
        ventas.splice(index, 1);
        guardarDatos();
        actualizarPendientes();
        actualizarHistorialVentas();
        mostrarToast('🗑️ Venta eliminada', 'info');
    }
}

// Buscar en pendientes
document.getElementById('buscarPendiente').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.pendiente-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Inicializar
actualizarListas();
actualizarPendientes();
showSection('venta');