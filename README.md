# 💰 Control de Ventas PWA

Aplicación web progresiva (PWA) para gestionar ventas, productos y compradores de manera simple y eficiente.

## ✨ Características

### 📊 Gestión Completa
- **Nueva Venta**: Registra ventas con autocompletado de productos y compradores
- **Productos**: Agrega, visualiza y elimina productos con sus precios
- **Compradores**: Gestiona tu base de clientes
- **Reportes**: Genera reportes diarios, semanales, mensuales o completos

### 🎨 Interfaz Moderna
- Diseño responsive y atractivo con gradientes
- Notificaciones toast en lugar de alerts
- Animaciones suaves y transiciones
- Iconos emoji para mejor UX
- Tema de colores verde profesional

### 🚀 Funcionalidades Avanzadas
- **Autocompletado**: Los productos se autorellenan con su precio
- **Historial**: Visualiza las últimas 5 ventas en tiempo real
- **Búsqueda rápida**: Filtra compradores al escribir
- **Exportar reportes**: Descarga reportes en formato texto
- **Formato de moneda**: Valores formateados en pesos chilenos (CLP)
- **Contadores**: Visualiza cantidad de productos y compradores
- **Eliminar items**: Botones para eliminar productos y compradores

### 💾 Almacenamiento
- Datos guardados en localStorage del navegador
- Funciona 100% offline
- No requiere servidor ni base de datos

## 🛠️ Instalación

1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador
3. Para instalar como PWA:
   - Chrome/Edge: Click en el ícono de instalación en la barra de direcciones
   - Safari iOS: "Agregar a pantalla de inicio"

## 📱 Uso

### Registrar una Venta
1. Ve a "Nueva Venta"
2. Selecciona o escribe el nombre del comprador
3. Selecciona el producto (el precio se autocompleta)
4. Ajusta el valor si es necesario
5. Selecciona el método de pago
6. Click en "Registrar Venta"

### Gestionar Productos
1. Ve a "Productos"
2. Ingresa nombre y valor del producto
3. Click en "Agregar Producto"
4. Para eliminar, usa el botón 🗑️ junto a cada producto

### Generar Reportes
1. Ve a "Reportes"
2. Selecciona el período (Diario/Semanal/Mensual/Todo)
3. Visualiza el resumen con totales por método de pago
4. Click en "Exportar Reporte" para descargar

## 🎯 Métodos de Pago

- 💳 **Transferencia**: Pagos electrónicos
- 💵 **Efectivo**: Pagos en efectivo
- ⏳ **Pendiente**: Ventas por cobrar

## 📂 Estructura de Archivos

```
Ventas_Martin/
├── index.html          # Estructura HTML
├── styles.css          # Estilos modernos y responsive
├── app.js              # Lógica de la aplicación
├── service-worker.js   # Service Worker para PWA
├── manifest.json       # Configuración PWA
└── README.md          # Este archivo
```

## 🔧 Tecnologías

- HTML5
- CSS3 (Gradientes, Flexbox, Grid, Animaciones)
- JavaScript Vanilla (ES6+)
- LocalStorage API
- Service Workers
- PWA

## 💡 Características Técnicas

- **Sin dependencias**: No requiere frameworks ni librerías
- **Responsive**: Funciona en móviles, tablets y desktop
- **Offline-first**: Funciona sin conexión a internet
- **Ligero**: Carga rápida y bajo consumo de recursos
- **Accesible**: Interfaz intuitiva y fácil de usar

## 📝 Notas

- Los datos se almacenan localmente en el navegador
- Si borras los datos del navegador, perderás la información
- Se recomienda exportar reportes regularmente como respaldo
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🎨 Personalización

Puedes personalizar los colores editando las variables en `styles.css`:
- Color principal: `#4CAF50` (verde)
- Gradiente de fondo: `#667eea` a `#764ba2` (púrpura)

## 📄 Licencia

Proyecto de uso libre para fines personales y comerciales.

---

**Desarrollado como control de ventas** | Ismael Flores | 2025
