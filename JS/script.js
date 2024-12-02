let pagina = 0; // Página actual para la paginación
let categoriaActual = 'juvenil'; // Categoría inicial por defecto
let librosLeidos = []; // Lista para almacenar libros marcados como leídos

// Elementos HTML referenciados
const contenedor = document.getElementById('contenedor'); // Contenedor para mostrar los libros
const btnAnterior = document.getElementById('btnAnterior'); // Botón para retroceder páginas
const btnSiguiente = document.getElementById('btnSiguiente'); // Botón para avanzar páginas

// Función para cargar libros según la categoría seleccionada
const cargarLibros = async () => {
    let query = ''; // Variable para la consulta de búsqueda según la categoría
    switch (categoriaActual) { // Define el término de búsqueda según la categoría
        case 'juvenil':
            query = 'young adult';
            break;
        case 'terror':
            query = 'horror';
            break;
        case 'ciencia-ficcion':
            query = 'science fiction';
            break;
        case 'fantasia':
            query = 'fantasy';
            break;
        case 'suspenso':
            query = 'thriller';
            break;
        case 'romance': 
            query = 'romance';
            break;
    }

    // URL de la API de Google Books con la consulta
    const apiKey = "AIzaSyA8BJfvC4Q_8Zjbu7eKDa_q3bxkDHQyY_g"; 
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${pagina * 10}&maxResults=10&key=${apiKey}`;

    try {
        const respuesta = await fetch(url); // Llama a la API de Google Books

        if (respuesta.ok) {
            const datos = await respuesta.json(); // Convierte la respuesta a JSON
            let contenido = ''; // Variable para construir el contenido HTML

            datos.items.forEach(libro => { // Itera sobre cada libro recibido
                const info = libro.volumeInfo; // Extrae la información relevante del libro

                // Crea un elemento HTML para cada libro
                contenido += `
                    <div class="pelicula">
                        <img class="poster" src="${info.imageLinks?.thumbnail || 'https://via.placeholder.com/100'}" alt="${info.title}">
                        <h3 class="titulo">${info.title}</h3>
                        <p>${info.authors?.join(", ") || "Autor desconocido"}</p>
                        <a href="${info.infoLink}" target="_blank">Más información</a>
                        <button class="btn-leido" onclick='marcarComoLeido(${JSON.stringify(info)})'>Marcar como leído</button>
                    </div>
                `;
            });

            contenedor.innerHTML = contenido; // Inserta los libros en el contenedor
        } else {
            console.error('Error al cargar libros:', respuesta.status); // Manejo de errores de la API
        }
    } catch (error) {
        console.error('Error:', error); // Manejo de errores de conexión
    }
};

// Función para marcar un libro como leído
const marcarComoLeido = (libro) => {
    if (!librosLeidos.find(l => l.title === libro.title)) { // Verifica si el libro ya está en la lista
        librosLeidos.push(libro); // Agrega el libro a la lista de leídos
        alert(`${libro.title} ha sido agregado a tu lista de libros leídos.`);
    } else {
        alert(`${libro.title} ya está en tu lista de libros leídos.`);
    }
};

// Función para mostrar la lista de libros leídos
const mostrarLibrosLeidos = () => {
    contenedor.innerHTML = ''; // Limpia el contenedor antes de mostrar los libros leídos

    if (librosLeidos.length === 0) {
        contenedor.innerHTML = '<p>No has agregado libros a tu lista de leídos.</p>';
    } else {
        librosLeidos.forEach(libro => { // Itera sobre los libros leídos
            contenedor.innerHTML += `
                <div class="pelicula">
                    <img class="poster" src="${libro.imageLinks?.thumbnail || 'https://via.placeholder.com/100'}" alt="${libro.title}">
                    <h3 class="titulo">${libro.title}</h3>
                    <p>${libro.authors?.join(", ") || "Autor desconocido"}</p>
                    <a href="${libro.infoLink}" target="_blank">Más información</a>
                </div>
            `;
        });
    }
};

// Eventos para cambiar de página
btnSiguiente.addEventListener('click', () => { // Avanzar página
    pagina += 1;
    cargarLibros();
});

btnAnterior.addEventListener('click', () => { // Retroceder página si no es la primera
    if (pagina > 0) {
        pagina -= 1;
        cargarLibros();
    }
});

// Evento para cambiar de categoría
document.querySelectorAll('.filter-btn').forEach(button => { // Agrega eventos a botones de filtro
    button.addEventListener('click', (e) => {
        categoriaActual = e.target.getAttribute('data-category'); // Cambia la categoría según el botón
        pagina = 0; // Reinicia la paginación
        cargarLibros();
    });
});

// Botón para mostrar libros leídos
document.getElementById('btnLeidos').addEventListener('click', mostrarLibrosLeidos);

// Carga inicial de libros
cargarLibros();
