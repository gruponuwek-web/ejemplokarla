// ============================================
// CONFIGURACIÓN - Wizard de 4 Pasos
// ============================================

async function renderConfig() {
    let currentStep = window.configStep || 1;
    const maxSteps = 4;
    const configContent = document.getElementById('configContent');
    
    console.log('🔧 Configuración abierta - Paso:', currentStep);

    // HTML del wizard
    configContent.innerHTML = `
        <!-- Stepper -->
        <div style="display: flex; align-items: center; justify-content: center; gap: var(--spacing-lg); margin-bottom: var(--spacing-2xl);">
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div class="stepper-circle active" data-step="1">1</div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-secondary);">Sucursales</span>
            </div>
            <div style="height: 2px; flex: 1; background-color: var(--color-border);"></div>
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div class="stepper-circle" data-step="2">2</div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-secondary);">Vendedores</span>
            </div>
            <div style="height: 2px; flex: 1; background-color: var(--color-border);"></div>
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div class="stepper-circle" data-step="3">3</div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-secondary);">Metas</span>
            </div>
            <div style="height: 2px; flex: 1; background-color: var(--color-border);"></div>
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div class="stepper-circle" data-step="4">4</div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-secondary);">Revisar</span>
            </div>
        </div>

        <!-- Contenido de pasos -->
        <div id="stepsContainer"></div>

        <!-- Botones de navegación -->
        <div style="display: flex; justify-content: space-between; margin-top: var(--spacing-2xl);">
            <button id="btnAnterior" class="btn btn-secondary" style="display: none;">← Anterior</button>
            <button id="btnSiguiente" class="btn btn-primary">Siguiente →</button>
        </div>
    `;

    function showStep(step) {
        const container = document.getElementById('stepsContainer');
        window.configStep = step;
        
        console.log('📍 Moviéndose al paso:', step);

        // Actualizar circulitos
        document.querySelectorAll('.stepper-circle').forEach(c => c.classList.remove('active'));
        document.querySelector(`.stepper-circle[data-step="${step}"]`).classList.add('active');

        // Actualizar botones
        document.getElementById('btnAnterior').style.display = step === 1 ? 'none' : 'inline-flex';
        const btnSiguiente = document.getElementById('btnSiguiente');
        btnSiguiente.textContent = step === maxSteps ? 'Listo' : 'Siguiente →';

        // Renderizar contenido del paso
        if (step === 1) renderStepSucursales(container);
        else if (step === 2) renderStepVendedores(container);
        else if (step === 3) renderStepMetas(container);
        else if (step === 4) renderStepRevision(container);

        currentStep = step;
    }

    function renderStepSucursales(container) {
        container.innerHTML = `
            <h3 style="font-family: var(--font-display); margin-bottom: var(--spacing-lg); font-size: 16px;">Paso 1: Gestionar Sucursales</h3>
            
            <form id="sucursalForm">
                <div class="form-group">
                    <label class="form-label">Nombre de la Sucursal</label>
                    <div style="display: flex; gap: var(--spacing-md);">
                        <input type="text" id="sucursalNombre" class="form-input" style="flex: 1;" placeholder="Ej: Sucursal Centro" required>
                        <button type="submit" class="btn btn-primary">+ Agregar</button>
                    </div>
                </div>
            </form>

            <h4 style="font-family: var(--font-display); font-size: 13px; margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md); color: var(--color-secondary); text-transform: uppercase;">Sucursales Existentes</h4>
            <div id="sucursalesList" style="background-color: var(--color-bg-light); border-radius: var(--radius-md); padding: var(--spacing-lg);"></div>
        `;

        renderSucursalesList();

        document.getElementById('sucursalForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('sucursalNombre').value.trim();
            if (!nombre) {
                console.warn('⚠️ Campo nombre vacío');
                alert('Ingresa un nombre');
                return;
            }

            if (state.sucursales.some(s => s.Nombre.toLowerCase() === nombre.toLowerCase())) {
                console.warn('⚠️ Sucursal duplicada:', nombre);
                alert('Esta sucursal ya existe');
                return;
            }

            const newId = 's' + (state.sucursales.length + 1);
            state.sucursales.push({ ID: newId, Nombre: nombre });
            console.log('✅ Sucursal agregada:', newId, nombre);
            saveToLocalStorage();
            
            // Guardar en Google Sheets
            try {
                await addSucursal(nombre);
                console.log('☁️ Sincronizado con Google Sheets');
            } catch(error) {
                console.warn('⚠️ Error al sincronizar:', error);
            }
            
            document.getElementById('sucursalNombre').value = '';
            renderSucursalesList();
        });
    }

    function renderSucursalesList() {
        const list = document.getElementById('sucursalesList');
        if (state.sucursales.length === 0) {
            list.innerHTML = '<div class="empty-item">No hay sucursales. Agrega la primera.</div>';
        } else {
            list.innerHTML = state.sucursales.map(s => `
                <div class="sucursal-item">
                    <div class="item-info">
                        <div class="item-name">• ${s.Nombre}</div>
                    </div>
                    <div class="item-actions">
                        <button type="button" class="btn-delete" onclick="eliminarSucursal('${s.ID}')">Eliminar</button>
                    </div>
                </div>
            `).join('');
        }
    }

    function renderStepVendedores(container) {
        container.innerHTML = `
            <h3 style="font-family: var(--font-display); margin-bottom: var(--spacing-lg); font-size: 16px;">Paso 2: Agregar Vendedores</h3>
            
            <form id="vendedorForm">
                <div class="form-group">
                    <label class="form-label">Nombre del Vendedor</label>
                    <input type="text" id="vendedorNombre" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Sucursal</label>
                    <div style="display: flex; gap: var(--spacing-md);">
                        <select id="vendedorSucursal" class="form-select" style="flex: 1;" required>
                            <option value="">Selecciona una sucursal</option>
                            ${state.sucursales.map(s => `<option value="${s.ID}">${s.Nombre}</option>`).join('')}
                        </select>
                        <button type="submit" class="btn btn-primary">+ Agregar</button>
                    </div>
                </div>
            </form>

            <h4 style="font-family: var(--font-display); font-size: 13px; margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md); color: var(--color-secondary); text-transform: uppercase;">Vendedores Existentes</h4>
            <div id="vendedoresList" style="background-color: var(--color-bg-light); border-radius: var(--radius-md); padding: var(--spacing-lg);"></div>
        `;

        renderVendedoresList();

        document.getElementById('vendedorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('vendedorNombre').value.trim();
            const sucursal = document.getElementById('vendedorSucursal').value;

            if (!nombre || !sucursal) {
                console.warn('⚠️ Campos incompletos:', { nombre, sucursal });
                alert('Completa todos los campos');
                return;
            }

            const newId = 'v' + (state.vendedores.length + 1);
            state.vendedores.push({ ID: newId, Nombre: nombre, Sucursal: sucursal });
            console.log('✅ Vendedor agregado:', newId, nombre, 'en sucursal:', sucursal);

            // Crear metas automáticas
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
            console.log('✅ Meta automática creada para:', newId);

            saveToLocalStorage();
            
            // Guardar en Google Sheets
            try {
                await addVendedor(nombre, sucursal);
                console.log('☁️ Vendedor sincronizado con Google Sheets');
            } catch(error) {
                console.warn('⚠️ Error al sincronizar vendedor:', error);
            }
            
            document.getElementById('vendedorNombre').value = '';
            document.getElementById('vendedorSucursal').value = '';
            renderVendedoresList();
        });
    }

    function renderVendedoresList() {
        const list = document.getElementById('vendedoresList');
        if (state.vendedores.length === 0) {
            list.innerHTML = '<div class="empty-item">No hay vendedores. Agrega el primero.</div>';
        } else {
            list.innerHTML = state.vendedores.map(v => {
                const sucursal = getSucursalById(v.Sucursal);
                return `
                    <div class="vendedor-item">
                        <div class="item-info">
                            <div class="item-name">• ${v.Nombre}</div>
                            <div class="item-meta">${sucursal?.Nombre || 'Sin sucursal'}</div>
                        </div>
                        <div class="item-actions">
                            <button type="button" class="btn-delete" onclick="eliminarVendedor('${v.ID}')">Eliminar</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    function renderStepMetas(container) {
        container.innerHTML = `
            <h3 style="font-family: var(--font-display); margin-bottom: var(--spacing-lg); font-size: 16px;">Paso 3: Cargar Metas del Mes</h3>
            
            <form id="metasForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
                    <div class="form-group">
                        <label class="form-label">Mes y Año</label>
                        <select id="metasMesAno" class="form-select" required></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Vendedor</label>
                        <select id="metasVendedor" class="form-select" required>
                            <option value="">Selecciona un vendedor</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
                    <div class="form-group">
                        <label class="form-label">Meta Ventas ($)</label>
                        <input type="number" id="metasVentas" class="form-input" min="0" step="100" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Meta Productos (#)</label>
                        <input type="number" id="metasProductos" class="form-input" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Meta Clientes (#)</label>
                        <input type="number" id="metasClientes" class="form-input" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Meta Promociones (#)</label>
                        <input type="number" id="metasPromociones" class="form-input" min="0" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">+ Guardar Metas</button>
            </form>

            <h4 style="font-family: var(--font-display); font-size: 13px; margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md); color: var(--color-secondary); text-transform: uppercase;" id="metasLoadedLabel">Metas Cargadas</h4>
            <div id="metasLoadedList" style="background-color: var(--color-bg-light); border-radius: var(--radius-md); padding: var(--spacing-lg);"></div>
        `;

        // Generar opciones de meses
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const year = getCurrentYear();
        document.getElementById('metasMesAno').innerHTML = meses.map((mes, idx) => `<option value="${idx}">${mes} ${year}</option>`).join('');
        document.getElementById('metasVendedor').innerHTML = '<option value="">Selecciona un vendedor</option>' + state.vendedores.map(v => `<option value="${v.ID}">${v.Nombre}</option>`).join('');

        renderMetasLoadedList();

        document.getElementById('metasForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const vendedor = document.getElementById('metasVendedor').value;
            const mes = parseInt(document.getElementById('metasMesAno').value);
            const metaVentas = parseInt(document.getElementById('metasVentas').value) || 0;
            const metaProductos = parseInt(document.getElementById('metasProductos').value) || 0;
            const metaClientes = parseInt(document.getElementById('metasClientes').value) || 0;
            const metaPromociones = parseInt(document.getElementById('metasPromociones').value) || 0;

            if (!vendedor) {
                console.warn('⚠️ Vendedor no seleccionado');
                alert('Selecciona un vendedor');
                return;
            }

            const existing = state.metas.find(m => m.Vendedor === vendedor && m.Mes === mes && m.Año === year);
            if (existing) {
                existing.Meta_Ventas = metaVentas;
                existing.Meta_Productos = metaProductos;
                existing.Meta_Clientes = metaClientes;
                existing.Meta_Promociones = metaPromociones;
                console.log('✅ Meta actualizada:', vendedor, metaVentas);
            } else {
                state.metas.push({
                    Vendedor: vendedor,
                    Mes: mes,
                    Año: year,
                    Meta_Ventas: metaVentas,
                    Meta_Productos: metaProductos,
                    Meta_Clientes: metaClientes,
                    Meta_Promociones: metaPromociones
                });
                console.log('✅ Meta agregada:', vendedor, metaVentas);
            }

            saveToLocalStorage();
            
            // Guardar en Google Sheets
            try {
                await addMeta(vendedor, mes, year, metaVentas, metaProductos, metaClientes, metaPromociones);
                console.log('☁️ Meta sincronizada con Google Sheets');
            } catch(error) {
                console.warn('⚠️ Error al sincronizar meta:', error);
            }
            
            document.getElementById('metasForm').reset();
            renderMetasLoadedList();
        });
    }

    function renderMetasLoadedList() {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const mesActual = getCurrentMonth();
        const year = getCurrentYear();
        const metasDelMes = state.metas.filter(m => m.Mes === mesActual && m.Año === year);
        
        document.getElementById('metasLoadedLabel').textContent = `Metas Cargadas (${meses[mesActual]} ${year})`;
        
        const list = document.getElementById('metasLoadedList');
        if (metasDelMes.length === 0) {
            list.innerHTML = '<div class="empty-item">No hay metas cargadas para este mes.</div>';
        } else {
            list.innerHTML = metasDelMes.map(m => {
                const vendedor = getVendedorById(m.Vendedor);
                return `
                    <div class="meta-item">
                        <div class="item-info">
                            <div class="item-name">• ${vendedor?.Nombre || 'Desconocido'}</div>
                            <div class="item-meta">${formatCurrency(m.Meta_Ventas)} | ${m.Meta_Productos} prod | ${m.Meta_Clientes} clientes | ${m.Meta_Promociones} promos</div>
                        </div>
                        <div class="item-actions">
                            <button type="button" class="btn-delete" onclick="eliminarMeta('${m.Vendedor}', ${m.Mes}, ${m.Año})">Eliminar</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    function renderStepRevision(container) {
        container.innerHTML = `
            <h3 style="font-family: var(--font-display); margin-bottom: var(--spacing-lg); font-size: 16px;">Paso 4: Revisar Configuración</h3>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-lg);">
                <div style="background-color: var(--color-bg-light); padding: var(--spacing-lg); border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 32px; margin-bottom: var(--spacing-md);">✓</div>
                    <div style="font-family: var(--font-display); font-weight: 700; margin-bottom: var(--spacing-sm);">${state.sucursales.length}</div>
                    <div style="font-size: 12px; color: var(--color-secondary); text-transform: uppercase;">Sucursales</div>
                </div>
                <div style="background-color: var(--color-bg-light); padding: var(--spacing-lg); border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 32px; margin-bottom: var(--spacing-md);">✓</div>
                    <div style="font-family: var(--font-display); font-weight: 700; margin-bottom: var(--spacing-sm);">${state.vendedores.length}</div>
                    <div style="font-size: 12px; color: var(--color-secondary); text-transform: uppercase;">Vendedores</div>
                </div>
                <div style="background-color: var(--color-bg-light); padding: var(--spacing-lg); border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 32px; margin-bottom: var(--spacing-md);">✓</div>
                    <div style="font-family: var(--font-display); font-weight: 700; margin-bottom: var(--spacing-sm);" id="reviewMetas">0</div>
                    <div style="font-size: 12px; color: var(--color-secondary); text-transform: uppercase;">Metas</div>
                </div>
            </div>

            <div style="background-color: #d1fae5; border: 1px solid #10b981; border-radius: var(--radius-md); padding: var(--spacing-lg); margin-top: var(--spacing-lg); text-align: center;">
                <div style="color: #047857; font-weight: 700;">✓ Sistema listo para usar</div>
            </div>
        `;

        const mesActual = getCurrentMonth();
        const year = getCurrentYear();
        const metasDelMes = state.metas.filter(m => m.Mes === mesActual && m.Año === year).length;
        document.getElementById('reviewMetas').textContent = metasDelMes + '/' + state.vendedores.length;
    }

    // Handlers de navegación
    document.getElementById('btnAnterior').addEventListener('click', async () => {
        if (currentStep > 1) showStep(currentStep - 1);
    });

    document.getElementById('btnSiguiente').addEventListener('click', async () => {
        if (currentStep < maxSteps) {
            showStep(currentStep + 1);
        } else {
            alert('Configuración completada. El sistema está listo.');
            renderDashboard();
            renderFilters();
        }
    });

    // Mostrar primer paso
    showStep(1);
}