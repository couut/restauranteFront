const BASEURL = 'http://127.0.0.1:5000';

/**
 * Función para realizar una petición fetch con JSON.
 * @param {string} url - La URL a la que se realizará la petición.
 * @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
 */
async function fetchData(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,  // Si hay datos, los convierte a JSON y los incluye en el cuerpo
    };
    try {
        const response = await fetch(url, options);  // Realiza la petición fetch
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();  // Devuelve la respuesta en formato JSON
    } catch (error) {
        console.error('Fetch error:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message ||'Hubo un error al intentar guardar la reserva.',
            icon: 'error',
        });
        return null; // Ensure to return null in case of an error
    }
}

/**
 * Función para comunicarse con el servidor para poder Crear o Actualizar
 * un registro de reserva.
 */
async function saveReserva(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario (recargar la página)
    
    const idReserva = document.querySelector('#idreserva2').value;
    const nombre = document.querySelector('#nombre2').value;
    const telefono = document.querySelector('#telefono2').value;
    const email = document.querySelector('#email2').value;
    const comensales = document.querySelector('#comensales2').value;
    const menu = document.querySelector('#menu2').value;
    const fecha = document.querySelector('#fecha2').value;
    const horario = document.querySelector('#horario2').value;

    if (!nombre || !telefono || !email || !comensales || !menu || !fecha || !horario) {
        Swal.fire({
                title: 'Error!',
                text: 'Por favor completa todos los campos.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
        });
        return;
    }

    // Crea un objeto con los datos de la reserva
    const reservaData = {
            nombre: nombre,
            telefono: telefono,
            email: email,
            comensales: comensales,
            menu: menu,
            fecha: fecha,
            horario: horario,
    };

    let result = null;
    // Si hay un id, hace una petición PUT para actualizar la reserva de la base de datos
    if (idReserva !== "") {
        result = await fetchData(`${BASEURL}/api/reserva/${idReserva}`, 'PUT', reservaData);
    } else {
        // Si no hay un id, te genera una nueva reserva mediante metodo POST
        result = await fetchData(`${BASEURL}/api/reserva/`, 'POST', reservaData);
        if (result ==null){
            Swal.fire({
                title: 'Error!',
                text: 'La fecha y hora seleccionada ya se encuentra ocupada.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }
    }

    if (result) {
        const formReservas = document.querySelector('#formularioo');
        formReservas.reset();
        Swal.fire({
            title: 'Éxito!',
            text: result.mensaje,
            icon: 'success',
            confirmButtonText: 'Cerrar'
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const formReservas = document.querySelector('#formularioo');
    // Asociar una función al evento submit del formulario
    formReservas.addEventListener('submit', saveReserva);
})