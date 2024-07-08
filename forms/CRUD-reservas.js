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
async function saveReserva() {
    const idReserva = document.querySelector('#id-reserva').value;
    const nombre = document.querySelector('#nombre').value;
    const telefono = document.querySelector('#telefono').value;
    const email = document.querySelector('#email').value;
    const comensales = document.querySelector('#comensales').value;
    const menu = document.querySelector('#menu').value;
    const fecha = document.querySelector('#fecha').value;
    const horario = document.querySelector('#horario').value;

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
        const formReservas = document.querySelector('#form-reserva');
        formReservas.reset();
        Swal.fire({
            title: 'Éxito!',
            text: result.message,
            icon: 'success',
            confirmButtonText: 'Cerrar'
        });
        showReservas();
    }
}

async function showReservas() {
    let reservas = await fetchData(BASEURL + '/api/reserva/', 'GET');
    if (!reservas) {
        console.error('No se pudieron obtener las reservas.');
        return;
    }
    const tableReservas = document.querySelector('#list-table-reservas tbody');
    tableReservas.innerHTML = '';
    reservas.forEach((reserva) => {
        let tr = `<tr>
                      <td>${reserva.nombre}</td>
                      <td>${reserva.telefono}</td>
                      <td>${reserva.email}</td>
                      <td>${reserva.comensales}</td>
                      <td>${reserva.menu}</td>
                      <td>${reserva.fecha}</td>
                      <td>${reserva.horario}</td>
                      <td>
                          <button class="btn-save-reservaa" onclick='updateReserva(${reserva.id_reserva})'><i class="fa fa-pencil"></i></button>
                          <button class="btn-save-reservaa" onclick='deleteReserva(${reserva.id_reserva})'><i class="fa fa-trash"></i></button>
                      </td>
                  </tr>`;
        tableReservas.insertAdjacentHTML("beforeend", tr);
    });
}

/**
 * Función que permite eliminar una reserva del servidor.
 * @param {number} id Id de la reserva que se va a eliminar
 */
function deleteReserva(id) {
    Swal.fire({
        title: "¿Está seguro de eliminar la reserva?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            let response = await fetchData(`${BASEURL}/api/reserva/${id}`, 'DELETE');
            if (response) {
                showReservas();
                Swal.fire(response.message, "", "success");
            }
        }
    });
}

/**
 * Función que permite cargar el formulario con los datos de la reserva 
 * para su edición.
 * @param {number} id Id de la reserva que se quiere editar
 */
async function updateReserva(id) {
    // Buscamos en el servidor la reserva de acuerdo al id
    let response = await fetchData(`${BASEURL}/api/reserva/${id}`, 'GET');
    if (response) {
        document.querySelector('#id-reserva').value = response.id_reserva;
        document.querySelector('#nombre').value = response.nombre;
        document.querySelector('#telefono').value = response.telefono;
        document.querySelector('#email').value = response.email;
        document.querySelector('#comensales').value = response.comensales;
        document.querySelector('#menu').value = response.menu;
        document.querySelector('#fecha').value = response.fecha;
        document.querySelector('#horario').value = response.horario;
    }
}

// Escuchar el evento 'DOMContentLoaded' que se dispara cuando el 
// contenido del DOM ha sido completamente cargado y parseado.
document.addEventListener('DOMContentLoaded', function () {
    const btnSaveReserva = document.querySelector('#btn-save-reserva');
    // Asociar una función al evento click del botón
    btnSaveReserva.addEventListener('click', saveReserva);
    showReservas();
});