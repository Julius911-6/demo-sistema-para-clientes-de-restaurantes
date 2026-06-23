# 🍗 Sistema de Caja - El Sabroso

Sistema de gestión de ventas y caja para **El Sabroso** - Negocio de venta de pollos y comidas rápidas.

## 📋 Características

### 💰 Módulo de Ventas
- **Catálogo de Productos**: 10 productos predefinidos con emojis y precios
  - Pollo Entero
  - Pechuga, Piernas, Alitas
  - Combo Familiar
  - Acompañamientos (Arepa, Tostones, Ensalada)
  - Bebidas (Refrescos y Jugos)

- **Carrito de Compra**: Interfaz intuitiva para agregar/quitar productos
- **Gestión de Cantidad**: Aumentar/disminuir cantidad con validación de stock
- **Cálculo de Descuentos**: Porcentaje de descuento configurable
- **Métodos de Pago**: 
  - Efectivo
  - Tarjeta de Crédito
  - Transferencia

### 📦 Módulo de Inventario
- **Visualización de Stock**: Tabla completa de productos y disponibilidad
- **Agregar Nuevos Productos**: Formulario modal para crear productos
- **Editar Stock**: Actualizar cantidades disponibles en tiempo real
- **Valor Total**: Cálculo automático del valor del inventario

### 📊 Módulo de Reportes
- **Resumen del Día**:
  - Total de ventas
  - Número de transacciones
  - Ticket promedio

- **Análisis de Pagos**: Desglose por método de pago
- **Productos Más Vendidos**: Top 5 productos
- **Historial de Ventas**: Registro completo con hora, productos y método de pago
- **Filtros por Fecha**: Rango personalizable para reportes

### ⚙️ Módulo de Configuración
- **Saldo Inicial**: Establecer caja de inicio del día
- **Copia de Seguridad**: 
  - Descargar datos en formato JSON
  - Importar datos previos

- **Resetear Día**: Limpiar caja y transacciones

## 🚀 Cómo Usar

### Acceso
Abra el archivo `index.html` en su navegador web:
```bash
open index.html
# o
start index.html
```

### Flujo de Trabajo

1. **Iniciar el Día**:
   - Ve a ⚙️ **Configuración**
   - Establece el saldo inicial en la caja

2. **Registrar Ventas**:
   - Ve a 💰 **Ventas**
   - Haz clic en los productos para agregarlos al carrito
   - Ajusta cantidades con +/-
   - Aplica descuento si es necesario
   - Selecciona método de pago
   - Haz clic en **"Completar Venta"**

3. **Consultar Inventario**:
   - Ve a 📦 **Inventario**
   - Visualiza stock y valores
   - Agrega nuevos productos con **"+ Agregar Producto"**
   - Edita stock disponible

4. **Ver Reportes**:
   - Ve a 📊 **Reportes**
   - Selecciona rango de fechas
   - Consulta resumen del día, métodos de pago y productos más vendidos

5. **Hacer Backup**:
   - Ve a ⚙️ **Configuración**
   - **Descargar Datos**: Guarda copia de seguridad
   - **Importar Datos**: Restaura datos previos

## 📊 Productos Disponibles

| Producto | Precio | Stock | Emoji |
|----------|--------|-------|-------|
| Pollo Entero | $45.00 | 20 | 🍗 |
| Pechuga (kg) | $38.00 | 30 | 🍗 |
| Piernas (kg) | $32.00 | 25 | 🥵 |
| Alitas (kg) | $28.00 | 40 | 🍖 |
| Combo Familiar | $120.00 | 15 | 👨‍👩‍👧‍👦 |
| Arepa con Queso | $8.00 | 50 | 🧆 |
| Tostones | $10.00 | 45 | 🍟 |
| Ensalada | $12.00 | 35 | 🥗 |
| Bebida Refr. (L) | $5.00 | 100 | 🥤 |
| Jugo Natural (L) | $7.00 | 60 | 🧃 |

## 💾 Almacenamiento de Datos

Todos los datos se guardan automáticamente en **localStorage** del navegador:
- Productos y stock
- Transacciones de ventas
- Saldo inicial
- Configuración

### Respaldo de Datos
- Descargar: Crea archivo JSON con todo el historial
- Importar: Restaura datos desde archivo previamente descargado

## 🎨 Diseño

- **Interfaz Moderna**: Gradientes morados y diseño limpio
- **Responsive**: Adaptable a dispositivos móviles y desktop
- **Intuición**: Iconos claros y navegación sencilla
- **Notificaciones**: Toast notifications para confirmaciones
- **Emojis**: Identidad visual con emojis en productos

## 📱 Compatibilidad

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Navegadores móviles

## 🔧 Archivos del Proyecto

```
PRUEBA-SISTEMA-POLLOS/
├── index.html       # Estructura HTML principal
├── styles.css       # Estilos y diseño responsive
├── app.js           # Lógica y funcionalidad
└── README.md        # Este archivo
```

## 🎯 Funcionalidades Futuras

- [ ] Base de datos en servidor
- [ ] Login y roles de usuario
- [ ] Código de barras
- [ ] Integración con métodos de pago
- [ ] Envío de recibos por email
- [ ] Gráficos estadísticos avanzados
- [ ] Sincronización en la nube

## 📝 Licencia

Libre para uso personal y comercial.

## 👨‍💻 Autor

Desarrollado para **El Sabroso** - 2026

---

**¡Gracias por usar nuestro sistema de caja!** 🍗✨
