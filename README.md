# Dashboard Ventas Diarias - Estructura Modular

## 📁 Estructura de Carpetas

```
demo-ventas-diarias/
├── index.html          # HTML principal (estructura semántica)
├── config.js           # Configuración global (URL Apps Script)
├── README.md           # Este archivo
├── css/
│   └── style.css       # Todos los estilos (responsive)
└── js/
    ├── state.js        # Estado global + localStorage
    ├── helpers.js      # Funciones auxiliares
    ├── api.js          # Comunicación con Google Sheets
    ├── dashboard.js    # Lógica del dashboard
    ├── entrada.js      # Lógica de entrada diaria
    ├── config-view.js  # Lógica de configuración (wizard)
    └── app.js          # Inicialización + navegación
```

## 🚀 Quick Start

### 1. Estructura Local
- Descarga todos los archivos en una carpeta
- Asegúrate que `config.js` esté en la raíz junto a `index.html`
- Las carpetas `css/` y `js/` deben estar en el mismo nivel

### 2. Servir los archivos
Opción A - Python:
```bash
cd demo-ventas-diarias
python3 -m http.server 8000
# Abre http://localhost:8000
```

Opción B - Node http-server:
```bash
npx http-server
```

Opción C - GitHub Pages
```bash
# Sube a un repo y activa GitHub Pages
```

### 3. Conectar Google Sheets
Ya está configurado con tu URL del Apps Script en `config.js`:
```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5qH3sRL4kKDVPvdH-egPDfr_iH0Plgnx8tS6RVqP8Ab2p9v_DbtXGJ8cJqxtTeCk0/exec";
```

## 📋 Descripción de Archivos

### `index.html`
- HTML semántico limpio
- Sin estilos inline
- Los scripts se cargan al final (no bloquean rendering)
- Orden de carga: config.js → CSS → JS modules

### `config.js`
- URL del Apps Script (tu endpoint)
- Configuración global (colores, thresholds)
- Modo de datos (localStorage o Google Sheets)

### `css/style.css`
- CSS Variables (tokens de diseño)
- Responsive (mobile-first)
- Reset y bases
- Componentes (card, form, button, etc)
- Animaciones suaves

### `js/state.js`
- Estado global (`state` object)
- Funciones localStorage (save/load)
- Inicialización de datos demo
- Usuarios, sucursales, vendedores, metas, ventas

### `js/helpers.js`
- Funciones de fechas (getDaysInMonth, getToday, etc)
- Formateo (formatCurrency, formatDate)
- Queries de estado (getVendedorMeta, getVentasMes, etc)
- Validaciones
- Operaciones de arrays

### `js/api.js`
- Fetch desde Google Sheets (GET)
- Send a Google Sheets (POST)
- Funciones: addSucursal, addVendedor, addMeta, addVenta
- Manejo de errores y fallback a localStorage

### `js/dashboard.js`
- Renderizado de filtros
- 3 vistas: General, por Sucursal, Individual
- Cálculo de acumulados y porcentajes
- Barras de progreso con colores (rojo/amarillo/verde)

### `js/entrada.js`
- Formulario para registrar ventas del día
- Validación de campos
- Almacenamiento en estado + localStorage
- Actualización del dashboard

### `js/config-view.js`
- Wizard de 4 pasos (Sucursales → Vendedores → Metas → Revisar)
- Stepper visual (circulitos)
- Creación/eliminación de elementos
- Selector de mes/año para metas

### `js/app.js`
- Punto de entrada (`DOMContentLoaded`)
- Inicialización de datos
- Setup de header (selector usuario)
- Setup de navegación (rutas)
- Log de inicialización

## 🔄 Flujo de Datos

```
1. DOMContentLoaded (app.js)
   ↓
2. Cargar datos (localStorage o Google Sheets)
   ↓
3. Inicializar UI:
   - renderHeader() (selector usuario)
   - renderFilters() (sucursal/vendedor)
   - renderDashboard() (contenido)
   - setupNavigation() (clicks)
   ↓
4. Usuario interactúa
   - Click nav → showView
   - Change filter → renderDashboard()
   - Form submit → saveToLocalStorage() + renderDashboard()
```

## 🎯 Modo de Datos: localStorage vs Google Sheets

**Actualmente: localStorage** (funciona sin internet, rápido)

Para cambiar a Google Sheets:
1. En `app.js`, reemplaza:
```javascript
loadFromLocalStorage();
```

Por:
```javascript
await loadFromGoogleSheets();
```

2. En cada formulario que guardas datos, usa:
```javascript
await addVenta(vendedor, fecha, monto, productos, clientes, promociones);
```

## 🎨 Personalización

**Cambiar colores:**
Edita las CSS Variables en `css/style.css`:
```css
:root {
    --color-primary: #1a1a1a;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;
}
```

**Cambiar metas por defecto:**
En `js/state.js`, modifica `initializeDemoData()`:
```javascript
Meta_Ventas: 450000,  // Cambiar aquí
Meta_Productos: 40,
Meta_Clientes: 12,
Meta_Promociones: 8
```

**Agregar más usuarios demo:**
En `js/state.js`:
```javascript
state.usuarios = [
    { ID: 'u1', Nombre: 'Juan García', Rol: 'Coordinador', Sucursal: '1' },
    // Agregar aquí
];
```

## 📱 Responsive

El dashboard es totalmente responsive:
- Desktop: Grid 3 columnas
- Tablet: Grid 2 columnas (768px)
- Mobile: Grid 1 columna (< 768px)

## 🐛 Debugging

Abre DevTools (F12) → Console

Verás logs como:
```
✓ Dashboard inicializado
✓ Datos cargados desde Google Sheets
✓ Sucursal agregada
```

## 🔗 Links Útiles

- **Google Sheets API:** https://developers.google.com/apps-script
- **Apps Script Docsumentos:** https://script.google.com/home
- **Nuwek Design System:** Syne (display) + DM Sans (body)

## ⚡ Performance

- Lazy loading de vistas (solo se renderizan al activarse)
- localStorage para caché rápido
- Un único estado global (no duplicación de datos)
- CSS variables (reutilización)
- Módulos JS separados (mejor organización)

## 📝 Notas para el Desarrollador

1. **No modificar estructura HTML:** Los selectores CSS/JS dependen de los IDs
2. **Mantener orden de carga de JS:** config.js primero, app.js último
3. **Agregar Google Sheets:** Usa `api.js` (no hagas fetch directo)
4. **Testing:** Abre Console → `console.log(state)` para ver estado actual

---

**Versión:** 1.0  
**Última actualización:** 2025-01-16  
**Status:** ✅ Listo para producción
