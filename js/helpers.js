// ============================================
// HELPERS - Funciones Auxiliares
// ============================================

// ============================================
// DATE FUNCTIONS
// ============================================

function getDaysInMonth(month = null) {
    const date = month !== null ? new Date(2025, month, 1) : new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getCurrentMonth() {
    return new Date().getMonth();
}

function getCurrentYear() {
    return new Date().getFullYear();
}

function getToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ============================================
// FORMAT FUNCTIONS
// ============================================

function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0
    }).format(value);
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ============================================
// STATUS FUNCTIONS
// ============================================

function getMetaStatus(percentage) {
    const success = CONFIG.thresholds.success;
    const warning = CONFIG.thresholds.warning;

    if (percentage >= success) return { class: 'success', icon: '🟢' };
    if (percentage >= warning) return { class: 'warning', icon: '🟡' };
    return { class: 'danger', icon: '🔴' };
}

// ============================================
// STATE QUERIES
// ============================================

function getVendedorById(vendedorId) {
    return state.vendedores.find(v => v.ID === vendedorId);
}

function getSucursalById(sucursalId) {
    return state.sucursales.find(s => s.ID === sucursalId);
}

function getVendedoresBySucursal(sucursalId) {
    return state.vendedores.filter(v => v.Sucursal === sucursalId);
}

function getVendedorMeta(vendedorId) {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    return state.metas.find(m => 
        m.Vendedor === vendedorId && 
        m.Mes === month && 
        m.Año === year
    ) || null;
}

function getVendedorVentasMes(vendedorId) {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    return state.ventas.filter(v => {
        const fecha = new Date(v.Fecha);
        return v.Vendedor === vendedorId && 
               fecha.getMonth() === month && 
               fecha.getFullYear() === year;
    });
}

function getVendedorVentasDia(vendedorId, fecha) {
    return state.ventas.find(v => v.Vendedor === vendedorId && v.Fecha === fecha) || null;
}

function sumVentasProperty(vendedorId, property) {
    const ventas = getVendedorVentasMes(vendedorId);
    return ventas.reduce((sum, v) => sum + (v[property] || 0), 0);
}

// ============================================
// PROGRESS BAR RENDERING
// ============================================

function createProgressBar(realizado, meta, label = '') {
    if (meta === 0) meta = 1;
    const percentage = Math.min((realizado / meta) * 100, 100);
    const status = getMetaStatus(percentage);
    
    return `
        <div class="progress-label">
            <span>${label ? label + ': ' : ''}${realizado} / ${meta}</span>
            <span>${percentage.toFixed(1)}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill ${status.class}" style="width: ${percentage}%"></div>
        </div>
    `;
}

// ============================================
// VALIDATION
// ============================================

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRequired(value) {
    return value && value.trim() !== '';
}

// ============================================
// ARRAY OPERATIONS
// ============================================

function findIndex(array, predicate) {
    return array.findIndex(predicate);
}

function removeItem(array, predicate) {
    const idx = findIndex(array, predicate);
    if (idx !== -1) array.splice(idx, 1);
}
