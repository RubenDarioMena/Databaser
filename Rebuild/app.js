// --- 1. EL ESTADO (La Memoria) ---
let estado = {
    // Ahora guardamos objetos para saber si están marcados o no (opcional, pero útil)
    // O simplemente seguimos con strings y asumimos que el checkbox es UI temporal.
    // Para simplificar y seguir la lección: Strings por ahora, el checkbox es visual.
    plataformas: ['PC', 'PlayStation 5', 'Xbox Series'],

    datos: [
        { id: 'd1', nombre: 'Data 1', texto: '' },
        { id: 'd2', nombre: 'Data 2', texto: '' }
    ],
    tabActiva: 'd1',
    textoBase: '' // [NUEVO] Texto global para verificar
};

// --- 2. REFERENCIAS AL DOM ---
const listaPlataformas = document.getElementById('lista-plataformas');
const inputPlataforma = document.getElementById('input-nueva-plataforma');
const btnAgregar = document.getElementById('btn-agregar');
const textoBaseArea = document.getElementById('texto-base'); // [NUEVO]

const tabsHeader = document.getElementById('tabs-header');
const tabContenido = document.getElementById('tab-contenido');
const btnNuevaTab = document.getElementById('btn-nueva-tab'); // [NUEVO]
const btnBorrarTab = document.getElementById('btn-borrar-tab'); // [NUEVO]

// --- 3. RENDERIZADO ---

function renderizarTodo() {
    renderizarPlataformas();
    renderizarTabs();
    actualizarContenidoTab();
    // Restaurar texto base (si hubiera persistencia, por ahora solo memoria)
    textoBaseArea.value = estado.textoBase;
}

function renderizarPlataformas() {
    listaPlataformas.innerHTML = '';
    estado.plataformas.forEach((nombre, index) => {
        const item = document.createElement('li');
        item.className = 'platform-item'; // Clase para estilo "Chip"

        // Estructura: Checkbox + Nombre + Botón Borrar
        item.innerHTML = `
            <label>
                <input type="checkbox" value="${nombre}" checked> 
                ${nombre}
            </label>
            <button class="btn-delete-plat" onclick="borrarPlataforma(${index})">✕</button>
        `;
        listaPlataformas.appendChild(item);
    });
}

function renderizarTabs() {
    tabsHeader.innerHTML = '';

    estado.datos.forEach(dato => {
        const btn = document.createElement('button');
        btn.textContent = dato.nombre;
        btn.className = 'tab-btn';

        if (dato.id === estado.tabActiva) {
            btn.classList.add('active');
        }

        btn.onclick = () => cambiarTab(dato.id);
        tabsHeader.appendChild(btn);
    });
}

function actualizarContenidoTab() {
    const datoActivo = estado.datos.find(d => d.id === estado.tabActiva);
    if (datoActivo) {
        tabContenido.value = datoActivo.texto;
    } else {
        tabContenido.value = ''; // Si no hay tabs, limpiar
    }
}

// --- 4. LÓGICA ---

// -- Plataformas --
function agregarPlataforma() {
    const nombre = inputPlataforma.value;
    if (nombre) {
        estado.plataformas.push(nombre);
        inputPlataforma.value = '';
        renderizarPlataformas();
    }
}

window.borrarPlataforma = function (index) {
    if (confirm('¿Borrar plataforma?')) {
        estado.plataformas.splice(index, 1);
        renderizarPlataformas();
    }
};

// -- Texto Base --
textoBaseArea.addEventListener('input', (e) => {
    estado.textoBase = e.target.value;
});

// -- Tabs --
function cambiarTab(nuevoId) {
    estado.tabActiva = nuevoId;
    renderizarTabs();
    actualizarContenidoTab();
}

function agregarTab() {
    const nombre = prompt("Nombre de la nueva pestaña (ej. Data 3):");
    if (nombre) {
        const nuevoId = 'd' + Date.now(); // ID único basado en el tiempo

        // 1. Crear nuevo objeto
        const nuevaTab = { id: nuevoId, nombre: nombre, texto: '' };

        // 2. Añadir al estado
        estado.datos.push(nuevaTab);

        // 3. Cambiar a la nueva tab automáticamente
        cambiarTab(nuevoId);
    }
}

function borrarTab() {
    // No permitir borrar si solo queda una (opcional, pero buena práctica)
    if (estado.datos.length <= 1) {
        alert("¡No puedes borrar la última pestaña!");
        return;
    }

    if (confirm("¿Seguro que quieres borrar esta pestaña y su contenido?")) {
        // 1. Encontrar índice de la tab activa
        const index = estado.datos.findIndex(d => d.id === estado.tabActiva);

        // 2. Borrarla
        estado.datos.splice(index, 1);

        // 3. Decidir cuál activar ahora (la anterior, o la primera)
        // Si borramos la 0, activamos la nueva 0. Si borramos la última, la anterior.
        const nuevoIndice = Math.max(0, index - 1);
        estado.tabActiva = estado.datos[nuevoIndice].id;

        renderizarTodo();
    }
}

// -- Contenido Tab --
tabContenido.addEventListener('input', (e) => {
    const datoActivo = estado.datos.find(d => d.id === estado.tabActiva);
    if (datoActivo) {
        datoActivo.texto = e.target.value;
    }
});

// --- 5. EVENTOS ---
btnAgregar.addEventListener('click', agregarPlataforma);
btnNuevaTab.addEventListener('click', agregarTab);
btnBorrarTab.addEventListener('click', borrarTab);

// --- 6. INICIO ---
renderizarTodo();
