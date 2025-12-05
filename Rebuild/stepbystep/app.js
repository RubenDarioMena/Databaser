
let state = {
	platforms: ['PC', 'PS5', 'XB4'],
	data: [
	{id: 'd1', name: 'Data 1', text:''},
	{id: 'd2', name: 'Data 2', text:''}
	],
	tabActive: 'd1'
}


const tabsHeader = document.getElementById("tabs-header");
const tabContent = document.getElementById("tab-content");
const inputTab = document.getElementById("new-data-field");
const btnAddTab = document.getElementById("btn-add-field");

const listPlatforms = document.getElementById("platforms-check");
const tabContent = document.getElementById("vf-content");
const inputPlatform = document.getElementById("new-platform");
const btnAddPlatform = document.getElementById("btn-add-platform");

console.log(listPlatforms);
console.log(inputPlatform);
console.log(btnAddPlatform);

function renderAll(){
	renderPlatform();
	renderTabs();
	updateTabContent();
	
}



function renderPlatform() {
    listPlatforms.innerHTML = '';

    state.platforms.forEach((name, index) => {
        const item = document.createElement('li');
        item.innerHTML = `
		<span>${name}</span>
		<button onclick="deletePlatform(${index})">borrar</button>
		`;
        listPlatforms.appendChild(item);
    });
}

function renderTabs(){
	tabsHeader.innerHTML = '';
	
	state.data.forEach(data => {
		const btn = document.createElement('button')
		btn.textContent = data.name;
		btn.ClassName = 'tab-btn';
		if(data.id === state.tabActive){
			btn.classList.add('active');
		}
		btn.onclick = () => changeTab(state.id);
		
		tabsHeader.appendChild(btn)
	});
}

updateTabContent(){
	const ActiveData = state.data.find(d => d.id === state.tabActive)

	if(ActiveData){
		tab-content.value = ActiveData.text;
	}
}




function addPlatform() {
    const newElement = inputPlatform.value;
    if (newElement !== '') {
        state.platforms.push(newElement);
        inputPlatform.value = '';
        render();
    }
}


window.deletePlatform = function (index) {
    platforms.splice(index, 1);
    render();
}



btnAddPlatform.addEventListener('click', addPlatform)

renderAll();


/*
/ --- 1. EL ESTADO (La Memoria) ---
// Ahora 'datos' es un Array de Objetos, no de textos simples.
let estado = {
    plataformas: ['PC', 'PlayStation 5', 'Xbox Series'],
    datos: [
        { id: 'd1', nombre: 'Data 1', texto: '' },
        { id: 'd2', nombre: 'Data 2', texto: '' }
    ],
    tabActiva: 'd1' // Guardamos el ID de la pestaña que estamos viendo
};

// --- 2. REFERENCIAS AL DOM ---
const listaPlataformas = document.getElementById('lista-plataformas');
const inputPlataforma = document.getElementById('input-nueva-plataforma');
const btnAgregar = document.getElementById('btn-agregar');

const tabsHeader = document.getElementById('tabs-header');
const tabContenido = document.getElementById('tab-contenido');

// --- 3. RENDERIZADO (El Pintor) ---

function renderizarTodo() {
    renderizarPlataformas();
    renderizarTabs();
    actualizarContenidoTab();
}

function renderizarPlataformas() {
    listaPlataformas.innerHTML = '';
    estado.plataformas.forEach((nombre, index) => {
        const item = document.createElement('li');
        item.innerHTML = `
            <span>${nombre}</span>
            <button onclick="borrarPlataforma(${index})">Eliminar</button>
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

        // Si esta pestaña es la activa, le ponemos la clase especial
        if (dato.id === estado.tabActiva) {
            btn.classList.add('active');
        }

        // Al hacer click, cambiamos la pestaña activa
        btn.onclick = () => cambiarTab(dato.id);

        tabsHeader.appendChild(btn);
    });
}

function actualizarContenidoTab() {
    // 1. Buscar el objeto de datos correspondiente a la tab activa
    const datoActivo = estado.datos.find(d => d.id === estado.tabActiva);

    // 2. Poner su texto en el textarea
    if (datoActivo) {
        tabContenido.value = datoActivo.texto;
    }
}

// --- 4. LÓGICA (El Cerebro) ---

function agregarPlataforma() {
    const nombre = inputPlataforma.value;
    if (nombre) {
        estado.plataformas.push(nombre);
        inputPlataforma.value = '';
        renderizarPlataformas();
    }
}

window.borrarPlataforma = function (index) {
    estado.plataformas.splice(index, 1);
    renderizarPlataformas();
};

function cambiarTab(nuevoId) {
    estado.tabActiva = nuevoId;
    renderizarTabs();       // Para actualizar qué botón se ve "activo"
    actualizarContenidoTab(); // Para cambiar el texto del textarea
}

// Cuando el usuario escribe en el textarea, guardamos eso en el Estado
tabContenido.addEventListener('input', (e) => {
    const textoEscrito = e.target.value;

    // Buscar el dato activo y actualizar su propiedad .texto
    const datoActivo = estado.datos.find(d => d.id === estado.tabActiva);
    if (datoActivo) {
        datoActivo.texto = textoEscrito;
    }
});

// --- 5. EVENTOS ---
btnAgregar.addEventListener('click', agregarPlataforma);

// --- 6. INICIO ---
renderizarTodo();
*/