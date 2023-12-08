const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const format = require('pg-format');

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'marketplace',
	allowExitOnIdle: true,
});

const getProducts = async () => {
	const { rows: productos } = await pool.query('SELECT * FROM productos;');
	return productos;
};

const getMyProducts = async () => {};

const verifyCrede = async (correo, contrasena) => {
	const formatQuery = format(
		'SELECT * FROM usuarios WHERE correo = %L',
		correo
	);
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(formatQuery);
	const { contrasena: contrasenaCrypt } = usuario;
	const contrasenaCorrecta = bcrypt.compareSync(contrasena, contrasenaCrypt);
	if (!contrasenaCorrecta || !rowCount) {
		throw { code: 401, message: `Email o contraseña incorrecta` };
	}
};

const registrarUsuario = async (usuario) => {
	const saltRounds = 10;
	let { nombre, apellido, correo, contrasena, genero } = usuario;
	const contrasenaCrypt = bcrypt.hashSync(contrasena, saltRounds);
	const formatQuery =
		format('INSERT INTO usuarios VALUES (DEFAULT, %L, %L, %L, %L, %L)',
		nombre,
		apellido,
		correo,
		contrasenaCrypt,
		genero);
	await pool.query(formatQuery);
};

module.exports = { getProducts, verifyCrede, registrarUsuario };
