// ============================================
// STATE - Estado Global
// ============================================

let state = {
    usuario: null,
    usuarios: [],
    sucursales: [],
    vendedores: [],
    metas: [],
    ventas: [],
    filtroSucursal: '',
    filtroVendedor: ''
};

// ============================================
// LOCAL STORAGE
// ============================================

function saveToLocalStorage() {
    localStorage.setItem('nuwek-ventas-state', JSON.stringify(state));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('nuwek-ventas-state');
    if (saved) {
        state = { ...state, ...JSON.parse(saved) };
    }
}

function clearLocalStorage() {
    localStorage.removeItem('nuwek-ventas-state');
}

// ============================================
// INICIALIZACIÓN DE DATOS (Demo)
// ============================================

function initializeDemoData() {
    state.usuarios = [
        { ID: 'u1', Nombre: 'Juan García', Rol: 'Coordinador', Sucursal: '1' },
        { ID: 'u2', Nombre: 'María López', Rol: 'Coordinador', Sucursal: '2' },
        { ID: 'u3', Nombre: 'Carlos Admin', Rol: 'Gerencia', Sucursal: '' }
    ];

    state.sucursales = [
        { ID: '1', Nombre: 'Sucursal 1' },
        { ID: '2', Nombre: 'Sucursal 2' },
        { ID: '3', Nombre: 'Sucursal 3' }
    ];

    state.vendedores = [
        { ID: 'v1', Nombre: 'Carlos Pérez', Sucursal: '1' },
        { ID: 'v2', Nombre: 'María López', Sucursal: '1' },
        { ID: 'v3', Nombre: 'Juan García', Sucursal: '2' },
        { ID: 'v4', Nombre: 'Ana Martínez', Sucursal: '2' },
        { ID: 'v5', Nombre: 'Luis Rodríguez', Sucursal: '3' },
        { ID: 'v6', Nombre: 'Sofia González', Sucursal: '3' },
        { ID: 'v7', Nombre: 'David Sánchez', Sucursal: '3' }
    ];

    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    state.metas = state.vendedores.map(v => ({
        Vendedor: v.ID,
        Mes: month,
        Año: year,
        Meta_Ventas: 450000,
        Meta_Productos: 40,
        Meta_Clientes: 12,
        Meta_Promociones: 8
    }));

    state.ventas = [
        { Vendedor: 'v1', Fecha: '2025-01-13', Monto: 13400, Productos: 3, Clientes: 1, Promociones: 0 },
        { Vendedor: 'v1', Fecha: '2025-01-14', Monto: 15900, Productos: 4, Clientes: 2, Promociones: 1 },
        { Vendedor: 'v1', Fecha: '2025-01-15', Monto: 14200, Productos: 3, Clientes: 1, Promociones: 1 },
        { Vendedor: 'v1', Fecha: '2025-01-16', Monto: 16800, Productos: 5, Clientes: 2, Promociones: 0 },
        { Vendedor: 'v2', Fecha: '2025-01-13', Monto: 18700, Productos: 5, Clientes: 2, Promociones: 1 },
        { Vendedor: 'v2', Fecha: '2025-01-14', Monto: 16200, Productos: 4, Clientes: 2, Promociones: 1 },
        { Vendedor: 'v3', Fecha: '2025-01-13', Monto: 12500, Productos: 2, Clientes: 1, Promociones: 0 },
        { Vendedor: 'v4', Fecha: '2025-01-14', Monto: 17600, Productos: 4, Clientes: 2, Promociones: 1 },
        { Vendedor: 'v5', Fecha: '2025-01-15', Monto: 14800, Productos: 3, Clientes: 1, Promociones: 0 },
        { Vendedor: 'v6', Fecha: '2025-01-16', Monto: 15900, Productos: 3, Clientes: 2, Promociones: 1 }
    ];

    state.usuario = state.usuarios[0];
    saveToLocalStorage();
}
