# 🚀 Setup Inicial - Dashboard Ventas Diarias

## ✅ Checklist de Instalación

### Paso 1: Descargar y Extraer
- [ ] Descargar `demo-ventas-diarias.zip`
- [ ] Extraer en tu máquina local
- [ ] Verificar estructura de carpetas

### Paso 2: Servir Localmente
Elige UNA opción:

**Opción A: Python (Recomendado)**
```bash
cd demo-ventas-diarias
python3 -m http.server 8000
# Abre http://localhost:8000
```

**Opción B: Node.js**
```bash
cd demo-ventas-diarias
npx http-server
```

**Opción C: VS Code Live Server**
- Instala extensión "Live Server"
- Click derecho en `index.html`
- "Open with Live Server"

### Paso 3: Verificar Funcionamiento
1. Abre el dashboard en navegador
2. Deberías ver datos de demo (7 vendedores, 3 sucursales)
3. Prueba:
   - [ ] Cambiar filtros (sucursal, vendedor)
   - [ ] Ir a "Entrada Hoy" y agregar venta
   - [ ] Ir a "Configuración" y agregar sucursal/vendedor
   - [ ] Ver que los datos se guardan en localStorage

### Paso 4: Conectar Google Sheets (Opcional)
1. Ya tienes la URL del Apps Script en `config.js`
2. Sube tu Google Sheet a drive
3. En `js/app.js`, cambia:
```javascript
// De:
loadFromLocalStorage();

// A:
await loadFromGoogleSheets();
```

### Paso 5: Publicar (GitHub Pages)
1. Crea repo en GitHub: `demo-ventas-diarias`
2. Sube todos los archivos:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuusuario/demo-ventas-diarias.git
git push -u origin main
```
3. En Settings > Pages > Source: Main branch
4. Accede a: `https://tuusuario.github.io/demo-ventas-diarias/`

---

## 📝 Archivos Importantes

```
demo-ventas-diarias/
├── config.js ← AQUI ESTÁ TU URL DEL APPS SCRIPT
├── index.html ← ABRE ESTE EN NAVEGADOR
└── js/app.js ← AQUI CAMBIAS DE localStorage A Google Sheets
```

---

## ⚡ Quick Commands

**Ver estado global:**
```javascript
// Abre Console (F12) y pega:
console.log(state);
```

**Limpiar localStorage:**
```javascript
localStorage.clear();
location.reload();
```

**Cambiar modo demo:**
En `js/state.js`, modifica `initializeDemoData()`

---

## 🆘 Troubleshooting

**"No se carga el CSS"**
- Verifica que `css/style.css` exista
- Abre DevTools (F12) > Network > busca style.css

**"Los JS no se cargan"**
- Verifica que la carpeta `js/` exista con todos los archivos
- En DevTools > Network busca cada .js

**"No funciona Google Sheets"**
- Abre Console (F12)
- Busca errores de CORS
- Verifica que la URL en `config.js` sea correcta

**"Los datos no se guardan"**
- Abre DevTools > Application > localStorage
- Busca key: `nuwek-ventas-state`
- Si no está, localStorage está deshabilitado

---

## 📞 Soporte

Revisa `README.md` para documentación completa

---

**Status:** ✅ Listo para usar  
**Última actualización:** 2025-01-16
