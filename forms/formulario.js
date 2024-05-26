const formulario = document.getElementById ("formulario_");
const inputs = document.querySelectorAll ("#formulario_ input");

const expresiones = {
	usuario: /^[a-zA-Z0-9]{2,16}$/, // Letras y numeros, de 2 a 16 caracteres
	nombre: /^[a-zA-Z\s]{4,16}$/, // Letras y espacios, de 4 a 16 caracteres
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{8,14}$/, // Solo numeros, de 7 a 14 digitos
	password: /^(?=.*\d)[A-Za-z\d]{4,12}$/, // Al menos un número, de 4 a 12 caracteres
	password2: /^(?=.*\d)[A-Za-z\d]{4,12}$/,
}

const campos = {
	usuario: false,
	nombre: false,
	correo: false,
	telefono: false,
	password: false,
}

const validarFormulario = (e) => {
	switch (e.target.name) {
		case "usuario":
			validarCampo (expresiones.usuario, e.target, "usuario");
			break;

		case "nombre":
			validarCampo (expresiones.nombre, e.target, "nombre");
			break;

		case "correo":
			validarCampo (expresiones.correo, e.target, "correo");
			break;

		case "telefono":
			validarCampo (expresiones.telefono, e.target, "telefono");
			break;

		case "password":
			validarCampo (expresiones.password, e.target, "password");
			break;

		case "password2":
			validarPassword2 ();
			break;

	}
}


const validarCampo = (expresion, input, campo) => {
	if (expresion.test(input.value)) {
		document.getElementById (`grupo_${campo}`).classList.remove ("formulario_grupo-incorrecto");
		document.getElementById (`grupo_${campo}`).classList.add ("formulario_grupo-correcto");
		document.querySelector (`#grupo_${campo} .formulario_input-error`).classList.remove ("formulario_input-error-activo");
		campos[campo] = true;
	} else {
		document.getElementById (`grupo_${campo}`).classList.add("formulario_grupo-incorrecto");
		document.getElementById (`grupo_${campo}`).classList.remove("formulario_grupo-correcto");
		document.querySelector (`#grupo_${campo} .formulario_input-error`).classList.add("formulario_input-error-activo");
		campos[campo] = false;
	}
}

const validarPassword2 = () => {
	const inputPassword1 = document.getElementById ("password");
	const inputPassword2 = document.getElementById ("password2");

	if (inputPassword1.value !== inputPassword2.value) {
		document.getElementById (`grupo_password2`).classList.add ("formulario_grupo-incorrecto");
		document.getElementById (`grupo_password2`).classList.remove ("formulario_grupo-correcto");
		document.querySelector (`#grupo_password2 .formulario_input-error`).classList.add ("formulario_input-error-activo");
	} else {
		document.getElementById (`grupo_password2`).classList.remove ("formulario_grupo-incorrecto");
		document.getElementById (`grupo_password2`).classList.add ("formulario_grupo-correcto");
		document.querySelector (`#grupo_password2 .formulario_input-error`).classList.remove ("formulario_input-error-activo");
	}
}

inputs.forEach ((input) => {
	input.addEventListener ("keyup", validarFormulario);
});

formulario.addEventListener ("submit", (e) => {
	e.preventDefault ();

	const terminos = document.getElementById ("terminos");
	if (campos.usuario && campos.nombre && campos.password && campos.correo && campos.telefono && terminos.checked ){
		formulario.reset ();

		document.getElementById ("formulario_mensaje-exito").classList.add ("formulario_mensaje-exito-activo");
		setTimeout(() => {
			document.getElementById ("formulario_mensaje-exito").classList.remove ("formulario_mensaje-exito-activo");
		}, 5000);

		document.querySelectorAll (".formulario_grupo-correcto").forEach ((icono) => {
			icono.classList.remove ("formulario_grupo-correcto");
		});
	} else {
		document.getElementById ("formulario_mensaje").classList.add ("formulario_mensaje-activo");setTimeout(() => {
			document.getElementById ("formulario_mensaje").classList.remove ("formulario_mensaje-activo");
		}, 3000);
	}
});