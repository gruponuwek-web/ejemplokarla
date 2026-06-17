// ============================================
// DASHBOARD - Lógica de Visualización
// ============================================

// ============================================
// FILTROS
// ============================================

function renderFilters() {
    const sucursalSelect = document.getElementById('filterSucursal');
    const vendedorSelect = document.getElementById('filterVendedor');

    sucursalSelect.innerHTML = '<option value="">Todas</option>' + 
        state.sucursales.map(s => 
            `<option value="${s.ID}">${s.Nombre}</option>`
        ).join('');

    sucursalSelect.value = state.filtroSucursal;

    const vendedoresDisponibles = state.filtroSucursal 
        ? state.vendedores.filter(v => v.Sucursal === state.filtroSucursal)
        : state.vendedores;

    vendedorSelect.innerHTML = '<option value="">Todos</option>' + 
        vendedoresDisponibles.map(v => 
            `<option value="${v.ID}">${v.Nombre}</option>`
        ).join('');

    vendedorSelect.value = state.filtroVendedor;

    sucursalSelect.addEventListener('change', (e) => {
        state.filtroSucursal = e.target.value;
        state.filtroVendedor = '';
        renderDashboard();
        renderFilters();
    });

    vendedorSelect.addEventListener('change', (e) => {
        state.filtroVendedor = e.target.value;
        renderDashboard();
    });
}

// ============================================
// DASHBOARD CONTENT
// ============================================

function renderDashboard() {
    const content = document.getElementById('dashboardContent');

    if (state.filtroVendedor) {
        // VISTA INDIVIDUAL DE VENDEDOR
        renderVendedorIndividual(content);
    } else if (state.filtroSucursal) {
        // VISTA POR SUCURSAL
        renderVistaSucursal(content);
    } else {
        // VISTA GENERAL
        renderVistaGeneral(content);
    }
}

function renderVendedorIndividual(container) {
    const vendedor = getVendedorById(state.filtroVendedor);
    const meta = getVendedorMeta(vendedor.ID);
    
    if (!meta) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Sin Metas</div><div class="empty-state-text">Este vendedor no tiene metas cargadas para este mes</div></div>';
        return;
    }

    const ventasMes = getVendedorVentasMes(vendedor.ID);
    const acumuladoMonto = sumVentasProperty(vendedor.ID, 'Monto');
    const acumuladoProductos = sumVentasProperty(vendedor.ID, 'Productos');
    const acumuladoClientes = sumVentasProperty(vendedor.ID, 'Clientes');
    const acumuladoPromociones = sumVentasProperty(vendedor.ID, 'Promociones');

    const daysInMonth = getDaysInMonth();
    const metaDiaria = meta.Meta_Ventas / daysInMonth;
    const hoyVentas = getVendedorVentasDia(vendedor.ID, getToday()) || { Monto: 0, Productos: 0, Clientes: 0, Promociones: 0 };
    const sucursal = getSucursalById(vendedor.Sucursal);

    container.innerHTML = `
        <div class="card">
            <div class="card-title">${vendedor.Nombre} - ${sucursal?.Nombre}</div>
            
            <h4 style="font-family: var(--font-display); margin: var(--spacing-lg) 0 var(--spacing-md); font-size: 14px;">RESUMEN MENSUAL</h4>
            <div class="metrics-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="metric">
                    <div class="metric-label">Ventas</div>
                    <div class="metric-value">${formatCurrency(acumuladoMonto)}</div>
                    <div class="metric-meta">${formatCurrency(meta.Meta_Ventas)} meta</div>
                    ${createProgressBar(acumuladoMonto, meta.Meta_Ventas)}
                </div>
                <div class="metric">
                    <div class="metric-label">Productos</div>
                    <div class="metric-value">${acumuladoProductos}</div>
                    <div class="metric-meta">${meta.Meta_Productos} meta</div>
                    ${createProgressBar(acumuladoProductos, meta.Meta_Productos)}
                </div>
                <div class="metric">
                    <div class="metric-label">Clientes Nuevos</div>
                    <div class="metric-value">${acumuladoClientes}</div>
                    <div class="metric-meta">${meta.Meta_Clientes} meta</div>
                    ${createProgressBar(acumuladoClientes, meta.Meta_Clientes)}
                </div>
                <div class="metric">
                    <div class="metric-label">Promociones</div>
                    <div class="metric-value">${acumuladoPromociones}</div>
                    <div class="metric-meta">${meta.Meta_Promociones} meta</div>
                    ${createProgressBar(acumuladoPromociones, meta.Meta_Promociones)}
                </div>
            </div>

            <h4 style="font-family: var(--font-display); margin: var(--spacing-lg) 0 var(--spacing-md); font-size: 14px;">HOY (Meta Diaria)</h4>
            <div class="metrics-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="metric">
                    <div class="metric-label">Ventas</div>
                    <div class="metric-value">${formatCurrency(hoyVentas.Monto)}</div>
                    <div class="metric-meta">${formatCurrency(metaDiaria)} meta</div>
                    ${createProgressBar(hoyVentas.Monto, metaDiaria)}
                </div>
                <div class="metric">
                    <div class="metric-label">Productos</div>
                    <div class="metric-value">${hoyVentas.Productos}</div>
                    <div class="metric-meta">${(meta.Meta_Productos / daysInMonth).toFixed(1)} meta</div>
                    ${createProgressBar(hoyVentas.Productos, meta.Meta_Productos / daysInMonth)}
                </div>
                <div class="metric">
                    <div class="metric-label">Clientes Nuevos</div>
                    <div class="metric-value">${hoyVentas.Clientes}</div>
                    <div class="metric-meta">${(meta.Meta_Clientes / daysInMonth).toFixed(2)} meta</div>
                    ${createProgressBar(hoyVentas.Clientes, meta.Meta_Clientes / daysInMonth)}
                </div>
                <div class="metric">
                    <div class="metric-label">Promociones</div>
                    <div class="metric-value">${hoyVentas.Promociones}</div>
                    <div class="metric-meta">${(meta.Meta_Promociones / daysInMonth).toFixed(2)} meta</div>
                    ${createProgressBar(hoyVentas.Promociones, meta.Meta_Promociones / daysInMonth)}
                </div>
            </div>

            <h4 style="font-family: var(--font-display); margin: var(--spacing-lg) 0 var(--spacing-md); font-size: 14px;">HISTÓRICO (Últimos 15 días)</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Ventas</th>
                        <th>Productos</th>
                        <th>Clientes</th>
                        <th>Promociones</th>
                    </tr>
                </thead>
                <tbody>
                    ${ventasMes.slice(-15).reverse().map(v => `
                        <tr>
                            <td>${formatDate(v.Fecha)}</td>
                            <td>${formatCurrency(v.Monto)}</td>
                            <td>${v.Productos}</td>
                            <td>${v.Clientes}</td>
                            <td>${v.Promociones}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderVistaSucursal(container) {
    const vendedoresEnSucursal = state.vendedores.filter(v => v.Sucursal === state.filtroSucursal);
    const sucursal = getSucursalById(state.filtroSucursal);

    container.innerHTML = `
        <div class="card">
            <div class="card-title">${sucursal.Nombre} - Vendedores</div>
            ${vendedoresEnSucursal.map(vendedor => {
                const meta = getVendedorMeta(vendedor.ID);
                if (!meta) return '';

                const acumuladoMonto = sumVentasProperty(vendedor.ID, 'Monto');
                const acumuladoProductos = sumVentasProperty(vendedor.ID, 'Productos');
                const acumuladoClientes = sumVentasProperty(vendedor.ID, 'Clientes');
                const acumuladoPromociones = sumVentasProperty(vendedor.ID, 'Promociones');

                return `
                    <div class="vendor-card">
                        <div class="vendor-name">${vendedor.Nombre}</div>
                        <div class="metrics-inline">
                            <div class="metric-inline">
                                <div class="metric-label">Ventas</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${formatCurrency(acumuladoMonto)} / ${formatCurrency(meta.Meta_Ventas)}</div>
                                ${createProgressBar(acumuladoMonto, meta.Meta_Ventas)}
                            </div>
                            <div class="metric-inline">
                                <div class="metric-label">Productos</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${acumuladoProductos} / ${meta.Meta_Productos}</div>
                                ${createProgressBar(acumuladoProductos, meta.Meta_Productos)}
                            </div>
                            <div class="metric-inline">
                                <div class="metric-label">Clientes</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${acumuladoClientes} / ${meta.Meta_Clientes}</div>
                                ${createProgressBar(acumuladoClientes, meta.Meta_Clientes)}
                            </div>
                            <div class="metric-inline">
                                <div class="metric-label">Promociones</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${acumuladoPromociones} / ${meta.Meta_Promociones}</div>
                                ${createProgressBar(acumuladoPromociones, meta.Meta_Promociones)}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderVistaGeneral(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-title">Resumen General - Todas Sucursales</div>
            ${state.sucursales.map(sucursal => {
                const vendedoresEnSucursal = state.vendedores.filter(v => v.Sucursal === sucursal.ID);
                const acumuladoMonto = vendedoresEnSucursal.reduce((sum, v) => sum + sumVentasProperty(v.ID, 'Monto'), 0);
                const metaTotalMonto = vendedoresEnSucursal.reduce((sum, v) => {
                    const meta = getVendedorMeta(v.ID);
                    return sum + (meta ? meta.Meta_Ventas : 0);
                }, 0);
                const acumuladoProductos = vendedoresEnSucursal.reduce((sum, v) => sum + sumVentasProperty(v.ID, 'Productos'), 0);
                const metaTotalProductos = vendedoresEnSucursal.reduce((sum, v) => {
                    const meta = getVendedorMeta(v.ID);
                    return sum + (meta ? meta.Meta_Productos : 0);
                }, 0);
                const acumuladoClientes = vendedoresEnSucursal.reduce((sum, v) => sum + sumVentasProperty(v.ID, 'Clientes'), 0);
                const metaTotalClientes = vendedoresEnSucursal.reduce((sum, v) => {
                    const meta = getVendedorMeta(v.ID);
                    return sum + (meta ? meta.Meta_Clientes : 0);
                }, 0);
                const acumuladoPromociones = vendedoresEnSucursal.reduce((sum, v) => sum + sumVentasProperty(v.ID, 'Promociones'), 0);
                const metaTotalPromociones = vendedoresEnSucursal.reduce((sum, v) => {
                    const meta = getVendedorMeta(v.ID);
                    return sum + (meta ? meta.Meta_Promociones : 0);
                }, 0);

                return `
                    <div class="vendor-card">
                        <div class="vendor-name">${sucursal.Nombre}</div>
                        <div class="metrics-inline">
                            <div class="metric-inline">
                                <div class="metric-label">Ventas</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${formatCurrency(acumuladoMonto)} / ${formatCurrency(metaTotalMonto)}</div>
                                ${createProgressBar(acumuladoMonto, metaTotalMonto)}
                            </div>
                            <div class="metric-inline">
                                <div class="metric-label">Productos</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${acumuladoProductos} / ${metaTotalProductos}</div>
                                ${createProgressBar(acumuladoProductos, metaTotalProductos)}
                            </div>
                            <div class="metric-inline">
                                <div class="metric-label">Clientes</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${acumuladoClientes} / ${metaTotalClientes}</div>
                                ${createProgressBar(acumuladoClientes, metaTotalClientes)}
                            </div>
                            <div class="metric-inline">
                                <div class="metric-label">Promociones</div>
                                <div style="font-weight: 700; margin-bottom: var(--spacing-sm);">${acumuladoPromociones} / ${metaTotalPromociones}</div>
                                ${createProgressBar(acumuladoPromociones, metaTotalPromociones)}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}
