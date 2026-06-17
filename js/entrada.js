// ============================================
// ENTRADA - Registro de Ventas Diarias
// ============================================

function renderEntrada() {
    const select = document.getElementById('entradaVendedor');
    select.innerHTML = '<option value="">Selecciona un vendedor</option>' + 
        state.vendedores.map(v => 
            `<option value="${v.ID}">${v.Nombre}</option>`
        ).join('');

    const form = document.getElementById('entradaForm');
    
    // Limpiar listeners anteriores
    form.onsubmit = null;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const vendedor = document.getElementById('entradaVendedor').value;
        if (!vendedor) {
            alert('Selecciona un vendedor');
            return;
        }

        const monto = parseInt(document.getElementById('entradaMonto').value) || 0;
        const productos = parseInt(document.getElementById('entradaProductos').value) || 0;
        const clientes = parseInt(document.getElementById('entradaClientes').value) || 0;
        const promociones = parseInt(document.getElementById('entradaPromociones').value) || 0;

        state.ventas.push({
            Vendedor: vendedor,
            Fecha: getToday(),
            Monto: monto,
            Productos: productos,
            Clientes: clientes,
            Promociones: promociones
        });

        saveToLocalStorage();
        form.reset();
        alert('Datos guardados correctamente');
        renderDashboard();
    });
}
