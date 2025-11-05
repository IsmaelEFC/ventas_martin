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

// Gestión de Pagos Pendientes - Agrupado por comprador
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
    
    // Agrupar por comprador
    const compradorMap = {};
    ventasPendientes.forEach(venta => {
        if (!compradorMap[venta.comprador]) {
            compradorMap[venta.comprador] = {
                nombre: venta.comprador,
                ventas: [],
                total: 0
            };
        }
        compradorMap[venta.comprador].ventas.push(venta);
        compradorMap[venta.comprador].total += venta.valor;
    });
    
    // Convertir a array y ordenar por deuda (mayor a menor)
    const compradoresArray = Object.values(compradorMap).sort((a, b) => b.total - a.total);
    
    // Mostrar lista agrupada
    listaPendientes.innerHTML = '';
    compradoresArray.forEach(comprador => {
        const div = document.createElement('div');
        div.className = 'comprador-group';
        div.onclick = () => mostrarDetalleComprador(comprador);
        
        const fechaMasAntigua = new Date(Math.min(...comprador.ventas.map(v => new Date(v.fecha))));
        const diasPendiente = Math.floor((new Date() - fechaMasAntigua) / (1000 * 60 * 60 * 24));
        
        div.innerHTML = `
            <div class="comprador-group-header">
                <div class="comprador-nombre">👤 ${comprador.nombre}</div>
                <div class="comprador-deuda">${formatearMoneda(comprador.total)}</div>
            </div>
            <div class="comprador-info">
                <span>📦 ${comprador.ventas.length} venta${comprador.ventas.length !== 1 ? 's' : ''}</span>
                <span>⏰ Desde hace ${diasPendiente} día${diasPendiente !== 1 ? 's' : ''}</span>
            </div>
        `;
        listaPendientes.appendChild(div);
    });
}

// Marcar venta como pagada
function marcarComoPagado(index, metodoPago) {
    if (index < 0 || index >= ventas.length) return;
    
    const venta = ventas[index];
    const nombreComprador = venta.comprador;
    const confirmacion = confirm(`¿Marcar como pagado con ${metodoPago}?\n\nComprador: ${venta.comprador}\nProducto: ${venta.producto}\nMonto: ${formatearMoneda(venta.valor)}`);
    
    if (confirmacion) {
        ventas[index].metodo = metodoPago;
        ventas[index].fechaPago = new Date().toISOString();
        guardarDatos();
        actualizarHistorialVentas();
        mostrarToast(`✅ Pago registrado: ${formatearMoneda(venta.valor)} en ${metodoPago}`, 'success');
        
        // Verificar si el comprador aún tiene pendientes
        const ventasPendientesComprador = ventas.filter(v => v.metodo === 'pendiente' && v.comprador === nombreComprador);
        
        if (ventasPendientesComprador.length > 0) {
            // Actualizar el detalle con las ventas restantes
            const comprador = {
                nombre: nombreComprador,
                ventas: ventasPendientesComprador,
                total: ventasPendientesComprador.reduce((sum, v) => sum + v.valor, 0)
            };
            mostrarDetalleComprador(comprador);
        } else {
            // Volver a la lista si no hay más pendientes
            volverAListaPendientes();
        }
        
        actualizarPendientes();
    }
}

// Eliminar venta
function eliminarVenta(index) {
    if (index < 0 || index >= ventas.length) return;
    
    const venta = ventas[index];
    const nombreComprador = venta.comprador;
    const confirmacion = confirm(`¿Eliminar esta venta?\n\nComprador: ${venta.comprador}\nProducto: ${venta.producto}\nMonto: ${formatearMoneda(venta.valor)}\n\n⚠️ Esta acción no se puede deshacer.`);
    
    if (confirmacion) {
        ventas.splice(index, 1);
        guardarDatos();
        actualizarHistorialVentas();
        mostrarToast('🗑️ Venta eliminada', 'info');
        
        // Verificar si el comprador aún tiene pendientes
        const ventasPendientesComprador = ventas.filter(v => v.metodo === 'pendiente' && v.comprador === nombreComprador);
        
        if (ventasPendientesComprador.length > 0) {
            // Actualizar el detalle con las ventas restantes
            const comprador = {
                nombre: nombreComprador,
                ventas: ventasPendientesComprador,
                total: ventasPendientesComprador.reduce((sum, v) => sum + v.valor, 0)
            };
            mostrarDetalleComprador(comprador);
        } else {
            // Volver a la lista si no hay más pendientes
            volverAListaPendientes();
        }
        
        actualizarPendientes();
    }
}

// Mostrar detalle del comprador
function mostrarDetalleComprador(comprador) {
    const listaPendientes = document.getElementById('listaPendientes');
    const detalleComprador = document.getElementById('detalleComprador');
    
    listaPendientes.style.display = 'none';
    detalleComprador.style.display = 'block';
    
    let html = `
        <div class="detalle-header">
            <div class="detalle-titulo">👤 ${comprador.nombre}</div>
            <div class="detalle-total">${formatearMoneda(comprador.total)}</div>
        </div>
        
        <div class="detalle-actions">
            <button class="btn-whatsapp" onclick="enviarWhatsApp('${comprador.nombre}', ${JSON.stringify(comprador.ventas).replace(/"/g, '&quot;')})">
                📱 Enviar por WhatsApp
            </button>
            <button class="btn-volver" onclick="volverAListaPendientes()">
                ← Volver
            </button>
        </div>
        
        <div class="detalle-ventas">
    `;
    
    comprador.ventas.forEach(venta => {
        const ventaIndex = ventas.indexOf(venta);
        const fecha = new Date(venta.fecha);
        const diasPendiente = Math.floor((new Date() - fecha) / (1000 * 60 * 60 * 24));
        
        html += `
            <div class="venta-item-detalle">
                <div class="venta-item-info">
                    <div class="venta-item-producto">📦 ${venta.producto}</div>
                    <div class="venta-item-fecha">
                        📅 ${fecha.toLocaleDateString('es-CL')} 
                        (${diasPendiente} día${diasPendiente !== 1 ? 's' : ''})
                    </div>
                </div>
                <div class="venta-item-monto">${formatearMoneda(venta.valor)}</div>
                <div class="venta-item-actions">
                    <button class="btn-pagar" onclick="marcarComoPagado(${ventaIndex}, 'efectivo')" title="Pagar en efectivo">💵</button>
                    <button class="btn-pagar" onclick="marcarComoPagado(${ventaIndex}, 'transferencia')" title="Pagar por transferencia">💳</button>
                    <button class="btn-eliminar-venta" onclick="eliminarVenta(${ventaIndex})" title="Eliminar venta">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    detalleComprador.innerHTML = html;
}

// Volver a la lista de pendientes
function volverAListaPendientes() {
    document.getElementById('listaPendientes').style.display = 'flex';
    document.getElementById('detalleComprador').style.display = 'none';
}

// Enviar detalle por WhatsApp
function enviarWhatsApp(nombreComprador, ventasArray) {
    const ventas = typeof ventasArray === 'string' ? JSON.parse(ventasArray.replace(/&quot;/g, '"')) : ventasArray;
    
    let mensaje = `Hola ${nombreComprador}! 👋\n\n`;
    mensaje += `Te envío el detalle de tus compras pendientes:\n\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    let total = 0;
    ventas.forEach((venta, index) => {
        const fecha = new Date(venta.fecha);
        mensaje += `\n${index + 1}. ${venta.producto}\n`;
        mensaje += `   💰 ${formatearMoneda(venta.valor)}\n`;
        mensaje += `   📅 ${fecha.toLocaleDateString('es-CL')}\n`;
        total += venta.valor;
    });
    
    mensaje += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `\n*TOTAL A PAGAR: ${formatearMoneda(total)}*\n\n`;
    mensaje += `Gracias por tu preferencia! 🙏`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Abrir WhatsApp (sin número específico, el usuario elige el contacto)
    const urlWhatsApp = `https://wa.me/?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    mostrarToast('📱 Abriendo WhatsApp...', 'info');
}

// Buscar en pendientes por comprador
document.getElementById('buscarPendiente').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.comprador-group');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Análisis de Productos
function mostrarAnalisisProductos() {
    const analisisDiv = document.getElementById('analisisProductos');
    const reporteDiv = document.getElementById('reporteContenido');
    
    // Ocultar reporte y mostrar análisis
    reporteDiv.style.display = 'none';
    document.getElementById('exportarBtn').style.display = 'none';
    analisisDiv.style.display = 'block';
    
    if (ventas.length === 0) {
        analisisDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <div class="empty-state-text">No hay ventas para analizar</div>
            </div>
        `;
        return;
    }
    
    // Analizar productos
    const productosMap = {};
    let totalVentas = 0;
    let totalIngresos = 0;
    
    ventas.forEach(venta => {
        if (!productosMap[venta.producto]) {
            productosMap[venta.producto] = {
                nombre: venta.producto,
                cantidad: 0,
                ingresos: 0,
                ultimaVenta: venta.fecha
            };
        }
        productosMap[venta.producto].cantidad++;
        productosMap[venta.producto].ingresos += venta.valor;
        
        // Actualizar última venta si es más reciente
        if (new Date(venta.fecha) > new Date(productosMap[venta.producto].ultimaVenta)) {
            productosMap[venta.producto].ultimaVenta = venta.fecha;
        }
        
        totalVentas++;
        totalIngresos += venta.valor;
    });
    
    // Convertir a array y ordenar por cantidad vendida
    const productosArray = Object.values(productosMap).sort((a, b) => b.cantidad - a.cantidad);
    
    // Calcular porcentajes y categorizar
    productosArray.forEach(producto => {
        producto.porcentajeVentas = (producto.cantidad / totalVentas * 100).toFixed(1);
        producto.porcentajeIngresos = (producto.ingresos / totalIngresos * 100).toFixed(1);
        producto.promedioVenta = producto.ingresos / producto.cantidad;
    });
    
    // Categorizar productos (Regla 80/20 adaptada)
    let acumuladoVentas = 0;
    const topSellers = [];
    const mediumSellers = [];
    const lowSellers = [];
    
    productosArray.forEach(producto => {
        acumuladoVentas += parseFloat(producto.porcentajeVentas);
        
        if (acumuladoVentas <= 60) {
            topSellers.push(producto);
        } else if (acumuladoVentas <= 85) {
            mediumSellers.push(producto);
        } else {
            lowSellers.push(producto);
        }
    });
    
    // Generar HTML
    let html = `
        <div class="analysis-header">
            <div class="analysis-title">📊 Análisis de Productos</div>
            <div class="analysis-period">Total: ${totalVentas} ventas</div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-box-value">${productosArray.length}</div>
                <div class="stat-box-label">Productos Diferentes</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-value">${formatearMoneda(totalIngresos)}</div>
                <div class="stat-box-label">Ingresos Totales</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-value">${formatearMoneda(totalIngresos / totalVentas)}</div>
                <div class="stat-box-label">Ticket Promedio</div>
            </div>
        </div>
        
        <div class="product-categories">
    `;
    
    // Top Sellers (60% de las ventas)
    if (topSellers.length > 0) {
        html += `
            <div class="category-section top-sellers">
                <div class="category-header">
                    <div class="category-title">🏆 Productos Estrella</div>
                    <div class="category-badge">${topSellers.length} producto${topSellers.length !== 1 ? 's' : ''}</div>
                </div>
                <p style="color:#666; margin-bottom:1em;">Generan el ${topSellers.reduce((sum, p) => sum + parseFloat(p.porcentajeVentas), 0).toFixed(1)}% de las ventas. ¡Mantén siempre en stock!</p>
        `;
        
        topSellers.forEach(producto => {
            const diasDesdeUltimaVenta = Math.floor((new Date() - new Date(producto.ultimaVenta)) / (1000 * 60 * 60 * 24));
            html += `
                <div class="product-item">
                    <div class="product-item-info">
                        <div class="product-item-name">🌟 ${producto.nombre}</div>
                        <div class="product-item-stats">
                            <span>📦 ${producto.cantidad} ventas (${producto.porcentajeVentas}%)</span>
                            <span>💰 ${producto.porcentajeIngresos}% de ingresos</span>
                            <span>⏰ Última venta: hace ${diasDesdeUltimaVenta} día${diasDesdeUltimaVenta !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="product-item-revenue">${formatearMoneda(producto.ingresos)}</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Medium Sellers (25% de las ventas)
    if (mediumSellers.length > 0) {
        html += `
            <div class="category-section medium-sellers">
                <div class="category-header">
                    <div class="category-title">⚡ Productos Regulares</div>
                    <div class="category-badge">${mediumSellers.length} producto${mediumSellers.length !== 1 ? 's' : ''}</div>
                </div>
                <p style="color:#666; margin-bottom:1em;">Ventas moderadas. Mantén stock razonable.</p>
        `;
        
        mediumSellers.forEach(producto => {
            const diasDesdeUltimaVenta = Math.floor((new Date() - new Date(producto.ultimaVenta)) / (1000 * 60 * 60 * 24));
            html += `
                <div class="product-item">
                    <div class="product-item-info">
                        <div class="product-item-name">📦 ${producto.nombre}</div>
                        <div class="product-item-stats">
                            <span>📦 ${producto.cantidad} ventas (${producto.porcentajeVentas}%)</span>
                            <span>💰 ${producto.porcentajeIngresos}% de ingresos</span>
                            <span>⏰ Última venta: hace ${diasDesdeUltimaVenta} día${diasDesdeUltimaVenta !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="product-item-revenue">${formatearMoneda(producto.ingresos)}</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Low Sellers (15% de las ventas)
    if (lowSellers.length > 0) {
        html += `
            <div class="category-section low-sellers">
                <div class="category-header">
                    <div class="category-title">⚠️ Productos de Baja Rotación</div>
                    <div class="category-badge">${lowSellers.length} producto${lowSellers.length !== 1 ? 's' : ''}</div>
                </div>
                <p style="color:#666; margin-bottom:1em;">Ventas bajas. Considera reducir inventario o descontinuar.</p>
        `;
        
        lowSellers.forEach(producto => {
            const diasDesdeUltimaVenta = Math.floor((new Date() - new Date(producto.ultimaVenta)) / (1000 * 60 * 60 * 24));
            html += `
                <div class="product-item">
                    <div class="product-item-info">
                        <div class="product-item-name">📉 ${producto.nombre}</div>
                        <div class="product-item-stats">
                            <span>📦 ${producto.cantidad} ventas (${producto.porcentajeVentas}%)</span>
                            <span>💰 ${producto.porcentajeIngresos}% de ingresos</span>
                            <span>⏰ Última venta: hace ${diasDesdeUltimaVenta} día${diasDesdeUltimaVenta !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="product-item-revenue">${formatearMoneda(producto.ingresos)}</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    
    // Recomendaciones
    html += `
        <div class="recommendation">
            <div class="recommendation-title">💡 Recomendaciones</div>
            <div class="recommendation-text">
                <strong>Productos Estrella (${topSellers.length}):</strong> Estos productos generan la mayor parte de tus ventas. 
                Asegúrate de mantenerlos siempre en stock y considera aumentar su visibilidad.<br><br>
                
                <strong>Productos Regulares (${mediumSellers.length}):</strong> Tienen ventas moderadas. 
                Mantén un stock equilibrado y monitorea su desempeño.<br><br>
                
                <strong>Productos de Baja Rotación (${lowSellers.length}):</strong> Considera reducir el inventario de estos productos 
                o evaluar si vale la pena mantenerlos en tu catálogo. Podrías hacer promociones para liquidarlos.
            </div>
        </div>
    `;
    
    analisisDiv.innerHTML = html;
    mostrarToast('📊 Análisis generado exitosamente', 'success');
}

// Inicializar
actualizarListas();
actualizarPendientes();
showSection('venta');