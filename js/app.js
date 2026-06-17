// ============================================
// APP - Inicialización Principal
// ============================================

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
    // Cargar datos
    loadFromLocalStorage();
    
    // Si no hay datos, inicializar con demo
    if (state.usuarios.length === 0) {
        initializeDemoData();
    }
    
    // Inicializar UI
    renderHeader();
    renderFilters();
    renderDashboard();
    setupNavigation();
    
    console.log('✓ Dashboard inicializado');
});
