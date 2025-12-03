
let platforms = ['PC','PS5','XB4'];

const listElement = document.getElementById("data-tabs");
const inputElement = document.getElementById("new-platform");
const btnAdd = document.getElementById("btn-add");

console.log(listElement);
console.log(inputElement);
console.log(btnAdd);

function render(){
	listElement.innerHTML='';
	
	platforms.forEach((name,index) => {
		const item = document.createElement('li');
		item.innerHTML=`
		<span>${name}</span>
		<button onclick="deletePlatform(${index})">borrar</button>
		`;
		listElement.appendChild(item);
	}
	)
}

function addPlatform() {
	const newElement = inputElement.value;
	if (newElement !== ''){
		platforms.push(newElement);
		inputElement.value = '';
		render();
	}
}


window.deletePlatform = function(index) {
	platforms.splice(index,1);
	render();
}



btnAdd.addEventListener('click', addPlatform)

render()


/*
// --- 1. EL ESTADO (La Memoria) ---
// Aquí vive la "verdad". La interfaz es solo un reflejo de esto.
let plataformas = ['PC', 'PlayStation 5', 'Xbox Series'];

// --- 2. REFERENCIAS AL DOM (Los Brazos) ---
// Buscamos los elementos una sola vez para no buscarlos cada vez que hacemos algo.
const listaElemento = document.getElementById('lista-plataformas');
const inputElemento = document.getElementById('input-nueva-plataforma');
const btnAgregar = document.getElementById('btn-agregar');

// --- 3. FUNCIÓN DE RENDERIZADO (El Pintor) ---
// Esta función borra todo y lo vuelve a dibujar basado en el Estado.
// Es "declarativa": "Así quiero que se vea", en lugar de "Añade uno aquí, borra otro allá".
function renderizar() {
    console.log("Renderizando lista...", plataformas); // Chivato

    // Paso A: Limpiar el lienzo (borrar lo que había antes)
    listaElemento.innerHTML = '';

    // Paso B: Crear elementos por cada dato en el Estado
    plataformas.forEach((nombre, index) => {
        // 1. Crear el elemento <li>
        const item = document.createElement('li');

        // 2. Ponerle contenido (Texto + Botón Borrar)
        // Usamos template strings (``) para insertar variables fácilmente
        item.innerHTML = `
            <span>${nombre}</span>
            <button onclick="borrarPlataforma(${index})">Eliminar</button>
        `;

        // 3. Añadirlo al padre (<ul>)
        listaElemento.appendChild(item);
    });
}

// --- 4. FUNCIONES DE LÓGICA (El Cerebro) ---

function agregarPlataforma() {
    const nuevoNombre = inputElemento.value; // Leer lo que escribió el usuario

    if (nuevoNombre !== '') { // Validación básica
        plataformas.push(nuevoNombre); // Modificar el Estado
        inputElemento.value = '';      // Limpiar el input
        renderizar();                  // ¡Redibujar!
    }
}

// Esta función se llama desde el HTML (onclick)
// Recibe el índice (posición) del elemento a borrar
window.borrarPlataforma = function (index) {
    plataformas.splice(index, 1); // Borrar 1 elemento en la posición 'index'
    renderizar();                 // ¡Redibujar!
};

// --- 5. EVENTOS (Los Oídos) ---
// Escuchamos el click del botón
btnAgregar.addEventListener('click', agregarPlataforma);

// --- 6. INICIO ---
// Arrancamos todo por primera vez
renderizar();
*/