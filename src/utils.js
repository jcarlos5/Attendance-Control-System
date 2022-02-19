require('dotenv').config();
const { verify } = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const ERRORS = {
	SESION_ERROR: 'Aún no ha iniciado sesión.',
	PASSWORD_ERROR: 'La contraseña ingresada es incorrecta.',
	USERNAME_ERROR: (userName) => {
		return `El nombre de usuario '${userName}' no se encuentra registrado.`;
	},
	SERVER_ERROR: 'Ha ocurrido un error inesperado, no le cuente a nadie por favor :c',
	PERMISSIONS_ERROR: 'No tiene permisos suficientes para esta acción.',
};

function GET_USER_DATA(token) {
	if (token) {
		const { id, role } = verify(token, SECRET_KEY);
		if (id) {
			return { id, role };
		} else {
			throw new Error(ERRORS.SERVER_ERROR);
		}
	}

	throw new Error(ERRORS.SESION_ERROR);
}

module.exports = {
	SECRET_KEY,
	ERRORS,
	GET_USER_DATA,
};
