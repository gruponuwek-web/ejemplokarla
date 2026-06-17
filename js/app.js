// ============================================
// APP - Inicialización Principal
// ============================================

// ============================================
// FUNCIONES GLOBALES (Para config)
// ============================================

window.eliminarSucursal = function(sucursalId) {
    console.log('🗑️ Eliminando sucursal:', sucursalId);
    state.sucursales = state.sucursales.filter(x => x.ID !== sucursalId);
    // Eliminar vendedores de esa sucursal también
    state.vendedores = state.vendedores.filter(v => v.Sucursal !== sucursalId);
    state.metas = state.metas.filter(m => !state.vendedores.find(v => v.ID === m.Vendedor));
    saveToLocalStorage();
    renderConfig();
};

window.eliminarVendedor = function(vendedorId) {
    console.log('🗑️ Eliminando vendedor:', vendedorId);
    state.vendedores = state.vendedores.filter(x => x.ID !== vendedorId);
    state.metas = state.metas.filter(m => m.Vendedor !== vendedorId);
    saveToLocalStorage();
    renderConfig();
};

window.eliminarMeta = function(vendedorId, mes, año) {
    console.log('🗑️ Eliminando meta:', vendedorId, mes, año);
    state.metas = state.metas.filter(x => !(x.Vendedor === vendedorId && x.Mes === mes && x.Año === año));
    saveToLocalStorage();
    renderConfig();
};

// ============================================
// HEADER & USER SELECTOR
// ============================================

function renderHeader() {
    const userSelect = document.getElementById('userSelector');
    userSelect.innerHTML = state.usuarios.map(u => 
        `<option value="${u.ID}" ${state.usuario?.ID === u.ID ? 'selected' : ''}>${u.Nombre}</option>`
    ).join('');

    userSelect.addEventListener('change', (e) => {
        state.usuario = state.usuarios.find(u => u.ID === e.target.value);
        console.log('👤 Usuario cambiado a:', state.usuario.Nombre);
        saveToLocalStorage();
        renderDashboard();
        renderFilters();
    });
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const viewName = link.dataset.view;
            
            // Hide all views
            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Show selected view
            document.getElementById(viewName).classList.add('active');
            link.classList.add('active');
            
            // Render view content
            if (viewName === 'dashboard') {
                renderDashboard();
                renderFilters();
            } else if (viewName === 'entrada') {
                renderEntrada();
            } else if (viewName === 'config') {
                renderConfig();
            }
        });
    });
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard inicializando...');
    
    // Cargar datos
    loadFromLocalStorage();
    
    // Si no hay datos, inicializar con demo
    if (state.usuarios.length === 0) {
        console.log('📊 Inicializando con datos demo');
        initializeDemoData();
    }
    
    // Inicializar UI
    renderHeader();
    renderFilters();
    renderDashboard();
    setupNavigation();
    
    console.log('✅ Dashboard inicializado correctamente');
    console.log('📦 Estado actual:', state);
});