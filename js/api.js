// ============================================
// API - Comunicación con Google Sheets
// ============================================

// ============================================
// FETCH DATA FROM GOOGLE SHEETS
// ============================================

async function fetchFromGoogleSheets(action) {
    try {
        const url = `${APPS_SCRIPT_URL}?action=${action}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${action}:`, error);
        return null;
    }
}

async function loadFromGoogleSheets() {
    try {
        const data = await fetchFromGoogleSheets('getAllData');
        
        if (data) {
            state.usuarios = data.usuarios || [];
            state.sucursales = data.sucursales || [];
            state.vendedores = data.vendedores || [];
            state.metas = data.metas || [];
            state.ventas = data.ventas || [];
            
            if (state.usuarios.length > 0) {
                state.usuario = state.usuarios[0];
            }
            
            console.log('✓ Datos cargados desde Google Sheets');
        }
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        console.log('Usando datos de demo (localStorage)');
        initializeDemoData();
    }
}

// ============================================
// SEND DATA TO GOOGLE SHEETS
// ============================================

async function sendToGoogleSheets(action, data) {
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams({
                action: action,
                ...data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`✓ ${result.message}`);
            return true;
        } else {
            console.error(`Error: ${result.error}`);
            return false;
        }
    } catch (error) {
        console.error(`Error sending to Google Sheets (${action}):`, error);
        return false;
    }
}

async function addSucursal(nombre) {
    const newId = 's' + (state.sucursales.length + 1);
    const success = await sendToGoogleSheets('addSucursal', {
        ID: newId,
        Nombre: nombre
    });
    
    if (success) {
        state.sucursales.push({ ID: newId, Nombre: nombre });
        saveToLocalStorage();
    }
    
    return success;
}

async function addVendedor(nombre, sucursal) {
    const newId = 'v' + (state.vendedores.length + 1);
    const success = await sendToGoogleSheets('addVendedor', {
        ID: newId,
        Nombre: nombre,
        Sucursal: sucursal
    });
    
    if (success) {
        state.vendedores.push({ ID: newId, Nombre: nombre, Sucursal: sucursal });
        
        // Agregar meta automática
        const month = getCurrentMonth();
        const year = getCurrentYear();
        state.metas.push({
            Vendedor: newId,
            Mes: month,
            Año: year,
            Meta_Ventas: 450000,
            Meta_Productos: 40,
            Meta_Clientes: 12,
            Meta_Promociones: 8
        });
        
        saveToLocalStorage();
    }
    
    return success;
}

async function addMeta(vendedor, mes, año, metaVentas, metaProductos, metaClientes, metaPromociones) {
    const success = await sendToGoogleSheets('addMeta', {
        Vendedor: vendedor,
        Mes: mes,
        Año: año,
        Meta_Ventas: metaVentas,
        Meta_Productos: metaProductos,
        Meta_Clientes: metaClientes,
        Meta_Promociones: metaPromociones
    });
    
    if (success) {
        const existing = state.metas.find(m => m.Vendedor === vendedor && m.Mes === mes && m.Año === año);
        if (existing) {
            existing.Meta_Ventas = metaVentas;
            existing.Meta_Productos = metaProductos;
            existing.Meta_Clientes = metaClientes;
            existing.Meta_Promociones = metaPromociones;
        } else {
            state.metas.push({
                Vendedor: vendedor,
                Mes: mes,
                Año: año,
                Meta_Ventas: metaVentas,
                Meta_Productos: metaProductos,
                Meta_Clientes: metaClientes,
                Meta_Promociones: metaPromociones
            });
        }
        saveToLocalStorage();
    }
    
    return success;
}

async function addVenta(vendedor, fecha, monto, productos, clientes, promociones) {
    const success = await sendToGoogleSheets('addVenta', {
        Vendedor: vendedor,
        Fecha: fecha,
        Monto: monto,
        Productos: productos,
        Clientes: clientes,
        Promociones: promociones
    });
    
    if (success) {
        state.ventas.push({
            Vendedor: vendedor,
            Fecha: fecha,
            Monto: monto,
            Productos: productos,
            Clientes: clientes,
            Promociones: promociones
        });
        saveToLocalStorage();
    }
    
    return success;
}
