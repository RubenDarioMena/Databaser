// --- ESTADO INICIAL Y CONFIGURACIÓN ---
const STORAGE_KEY = 'dbsr-min';

// Estado por defecto si no hay nada guardado
let state = {
    platforms: ['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series', 'Switch', 'Android', 'iOS'],
    dataTabs: [
        { id: 'Data1', label: 'Data 1', text: '' },
        { id: 'Data2', label: 'Data 2', text: '' }
    ],
    base: { comentarios: '', bugs: '' }
};

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderPlatforms();
    renderDataTabs();
    restoreBaseTexts();
    setupEventListeners();
});

// --- FUNCIONES DE RENDERIZADO ---

function renderPlatforms() {
    const container = document.getElementById('platforms');
    container.innerHTML = '';

    state.platforms.forEach(plat => {
        const label = document.createElement('label');
        label.className = 'chip';
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = plat;
        // Marcamos por defecto si queremos, pero dejaremos a elección del usuario
        
        // Texto
        const span = document.createElement('span');
        span.textContent = plat;

        // Botón eliminar
        const btnDel = document.createElement('button');
        btnDel.className = 'chip-del';
        btnDel.textContent = '✕';
        btnDel.onclick = (e) => {
            e.preventDefault(); // Evitar trigger del label
            deletePlatform(plat);
        };

        label.append(checkbox, span, btnDel);
        container.appendChild(label);
    });
}

function renderDataTabs() {
    const header = document.getElementById('data-tabs');
    const views = document.getElementById('data-views');
    
    // Guardar textos actuales del DOM al estado antes de re-renderizar (por si hubo cambios no guardados)
    // (Opcional simple: asumimos que el usuario usa 'Guardar', pero para pestañas dinámicas es mejor leer del estado).
    
    header.innerHTML = '';
    views.innerHTML = '';

    state.dataTabs.forEach((tab, index) => {
        // 1. Botón de pestaña
        const btn = document.createElement('button');
        btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = tab.label;
        btn.onclick = () => activateDataTab(index);
        header.appendChild(btn);

        // 2. Sección de contenido
        const section = document.createElement('section');
        section.className = `tab-view ${index === 0 ? 'active' : ''}`;
        section.setAttribute('data-id', tab.id);

        const textarea = document.createElement('textarea');
        textarea.id = `area-${tab.id}`;
        textarea.placeholder = `Pega aquí los datos para ${tab.label}...`;
        textarea.value = tab.text || '';
        // Listener simple para actualizar el estado en memoria localmente
        textarea.addEventListener('input', (e) => tab.text = e.target.value);

        section.appendChild(textarea);
        views.appendChild(section);
    });
}

function restoreBaseTexts() {
    document.getElementById('txt-comentarios').value = state.base.comentarios || '';
    document.getElementById('txt-bugs').value = state.base.bugs || '';
}

// --- LÓGICA DE PESTAÑAS ---

function activateDataTab(activeIndex) {
    const btns = document.querySelectorAll('#data-tabs .tab-btn');
    const views = document.querySelectorAll('#data-views .tab-view');

    btns.forEach((btn, i) => {
        if (i === activeIndex) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    views.forEach((view, i) => {
        if (i === activeIndex) view.classList.add('active');
        else view.classList.remove('active');
    });
}

// --- GESTIÓN DE EVENTOS ---

function setupEventListeners() {
    // Pestañas Base (Comentarios vs Bugs)
    const baseTabs = document.querySelectorAll('#base-tabs .tab-btn');
    baseTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Tabs
            baseTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // UI Views
            const targetId = btn.dataset.target;
            document.querySelectorAll('#base-views .tab-view').forEach(v => v.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Botones de Acción
    document.getElementById('btn-add-platform').onclick = addPlatform;
    document.getElementById('btn-add-data').onclick = addDataTab;
    document.getElementById('btn-clear-datos').onclick = clearDataOnly;
    document.getElementById('btn-clear').onclick = clearAll;
    document.getElementById('btn-save').onclick = saveState;
    document.getElementById('btn-check').onclick = runCheck;
}

// --- ACCIONES DE DATOS ---

function addPlatform() {
    const name = prompt("Nombre de la nueva plataforma:");
    if (name && !state.platforms.includes(name)) {
        state.platforms.push(name);
        renderPlatforms();
    }
}

function deletePlatform(name) {
    if (confirm(`¿Eliminar plataforma "${name}"?`)) {
        state.platforms = state.platforms.filter(p => p !== name);
        renderPlatforms();
    }
}

function addDataTab() {
    const name = prompt("Nombre del dato (ej. Data 3):");
    if (name) {
        const id = name.replace(/[^a-zA-Z0-9]/g, '') + Date.now(); // ID único simple
        state.dataTabs.push({ id: id, label: name, text: '' });
        renderDataTabs();
        // Activar la nueva pestaña
        activateDataTab(state.dataTabs.length - 1);
    }
}

function clearDataOnly() {
    if(confirm("¿Borrar contenido de todas las pestañas de Datos?")) {
        state.dataTabs.forEach(t => t.text = '');
        renderDataTabs();
    }
}

function clearAll() {
    if(confirm("¿Borrar TODO (Datos, Comentarios, Bugs y Resultados)?")) {
        clearDataOnly(); // Limpia data tabs state
        document.getElementById('txt-comentarios').value = '';
        document.getElementById('txt-bugs').value = '';
        document.getElementById('results').innerHTML = '<p class="placeholder-text">Los resultados aparecerán aquí...</p>';
        state.base.comentarios = '';
        state.base.bugs = '';
    }
}

// --- PERSISTENCIA ---

function saveState() {
    // Sincronizar textos actuales al estado
    state.base.comentarios = document.getElementById('txt-comentarios').value;
    state.base.bugs = document.getElementById('txt-bugs').value;
    // Nota: Los textos de Data ya se actualizan via evento 'input', pero aseguramos
    state.dataTabs.forEach(tab => {
        const area = document.getElementById(`area-${tab.id}`);
        if(area) tab.text = area.value;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    alert("Datos guardados correctamente.");
}

function loadState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Merge simple para asegurar estructura
            state = { ...state, ...parsed }; 
        } catch (e) {
            console.error("Error cargando save", e);
        }
    }
}

// --- CORE: PARSING Y CHECK ---

function runCheck() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    // 1. Obtener Plataformas Seleccionadas
    const checkedBoxes = document.querySelectorAll('#platforms input[type="checkbox"]:checked');
    const selectedPlatforms = Array.from(checkedBoxes).map(cb => cb.value);

    if (selectedPlatforms.length === 0) {
        resultsContainer.innerHTML = '<div class="result-item tag-error">⚠️ Selecciona al menos una plataforma.</div>';
        return;
    }

    // 2. Obtener Texto Base Activo
    let baseText = '';
    const activeBaseView = document.querySelector('#base-views .tab-view.active');
    if (activeBaseView) {
        baseText = activeBaseView.value;
    }

    if (!baseText.trim()) {
        resultsContainer.innerHTML = '<div class="result-item tag-error">⚠️ El texto base (Comentarios/Bugs) está vacío.</div>';
        return;
    }

    let errorCount = 0;
    let successCount = 0;

    // 3. Iterar Datos y Plataformas
    // Recorremos los tabs de datos actuales (usando el DOM para asegurar que tenemos lo visible)
    state.dataTabs.forEach(tab => {
        const textArea = document.getElementById(`area-${tab.id}`);
        const content = textArea ? textArea.value : '';
        
        if (!content.trim()) return; // Saltamos tabs vacíos

        selectedPlatforms.forEach(platform => {
            const val = extractValue(content, platform);

            if (val) {
                // Verificación literal
                if (baseText.includes(val)) {
                    successCount++;
                } else {
                    errorCount++;
                    const div = document.createElement('div');
                    div.className = 'result-item tag-error';
                    div.innerHTML = `<strong>${platform}</strong> - ${tab.label}: Valor "<em>${val}</em>" NO encontrado.`;
                    resultsContainer.appendChild(div);
                }
            } 
            // Si no se extrajo valor, decidimos no mostrar error para no saturar, 
            // o se podría mostrar "Dato no encontrado para plataforma X".
            // Según spec "Resultados: chips de éxito o de faltante", nos enfocamos en faltante en texto base.
        });
    });

    // 4. Resumen final
    if (errorCount === 0) {
        const div = document.createElement('div');
        div.className = 'result-item tag-success';
        div.textContent = `✅ Verificación Exitosa! (${successCount} valores encontrados)`;
        resultsContainer.appendChild(div);
    } else {
        // Agregar un header de error arriba o abajo
        const summary = document.createElement('div');
        summary.style.marginTop = '10px';
        summary.style.fontWeight = 'bold';
        summary.style.color = '#991b1b';
        summary.textContent = `Fallos: ${errorCount}. Aciertos: ${successCount}.`;
        resultsContainer.appendChild(summary);
    }
}

// Regla de parsing según spec #5
function extractValue(multiline, platform) {
    const lines = multiline.split('\n');
    // Regex: Inicio de linea o no-alfanumérico + PLATAFORMA + no-alfanumérico o fin
    const escapedPlat = platform.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    const regex = new RegExp(`(^|[^A-Za-z0-9])(${escapedPlat})(?=[^A-Za-z0-9]|$)`, 'i');

    for (let line of lines) {
        const match = line.match(regex);
        if (match) {
            // match[0] es todo el string encontrado.
            // match.index es donde empieza.
            // Necesitamos encontrar donde termina el token de la plataforma para buscar el espacio.
            
            // Estrategia simplificada: buscar el string de la plataforma dentro de la línea
            // ignorando case, y cortar desde ahí.
            
            const tokenIndex = line.toLowerCase().indexOf(platform.toLowerCase());
            // Avanzamos hasta el final del nombre de la plataforma
            let cursor = tokenIndex + platform.length;
            
            // Buscar el primer espacio desde 'cursor'
            const firstSpace = line.indexOf(' ', cursor);
            
            if (firstSpace !== -1) {
                const val = line.substring(firstSpace + 1).trim();
                if (val) return val;
            }
        }
    }
    return null;
}