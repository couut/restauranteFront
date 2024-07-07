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
      alert('An error occurred while fetching data. Please try again.');
      return null;
    }
}


async function saveReserva(){
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
  }else {
  // Si no hay un id, te genera una nueva reserva mediante metodo POST
    result = await fetchData(`${BASEURL}/api/reserva/`, 'POST', reservaData);
  }

  const formReservas = document.querySelector('#form-reservas');
  formReservas.reset();
  Swal.fire({
    title: 'Exito!',
    text: result.message,
    icon: 'success',
    confirmButtonText: 'Cerrar'
  })
  showReservas();
}
async function showReservas(){
  let reservas =  await fetchData(BASEURL+'/api/reserva/', 'GET');
  if (!reservas) {
    console.error('No se pudieron obtener las reservas.');
    return;
  }
  const tableReservas = document.querySelector('#list-table-reservas tbody');
  tableReservas.innerHTML='';
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
                      <button class="btn-reserva" onclick='updatereserva(${reserva.id_Reserva})'><i class="fa fa-pencil" ></button></i>
                      <button class="btn-reserva" onclick='deletereserva(${reserva.id_Reserva})'><i class="fa fa-trash" ></button></i>
                  </td>
                </tr>`;
    tableReservas.insertAdjacentHTML("beforeend",tr);
  });
}

async function deletereserva(idReserva){
  let result = await fetchData(`${BASEURL}/api/reserva/${idReserva}`, 'DELETE');
  Swal.fire({
    title: 'Exito!',
    text: result.message,
    icon: 'success',
    confirmButtonText: 'Cerrar'
  })
  showReservas();
}

// @param {number} id Id de la pelicula que se quiere editar

async function updatereserva(idreserva){
 //Buscamos en el servidor la pelicula de acuerdo al id
 let response = await fetchData(`${BASEURL}/api/reserva/${idreserva}`, 'GET');
 const idReserva = document.querySelector('#id-reserva').value;
 const nombre = document.querySelector('#nombre').value;
 const telefono = document.querySelector('#telefono').value;
 const email = document.querySelector('#email').value;
 const comensales = document.querySelector('#comensales').value;
 const menu = document.querySelector('#menu').value;
 const fecha = document.querySelector('#fecha').value;
 const horario = document.querySelector('#horario').value;
 
 idReserva.value = response.id_Reserva;
 nombre.value = response.nombre;
 telefono.value = response.telefono;
 email.value = response.email;
 comensales.value = response.comensales;
 menu.value = response.menu;
 fecha.value = response.fecha;
 horario.value = response.horario;
}
 
// Escuchar el evento 'DOMContentLoaded' que se dispara cuando el 
// contenido del DOM ha sido completamente cargado y parseado.
document.addEventListener('DOMContentLoaded',function(){
  const btnSaveReserva = document.querySelector('#btn-save-reserva');
  //ASOCIAR UNA FUNCION AL EVENTO CLICK DEL BOTON
  btnSaveReserva.addEventListener('click',saveReserva);
  showReservas();
});

