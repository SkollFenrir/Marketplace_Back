const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'marketplace',
	allowExitOnIdle: true,
});

const getProducts = async () => {
	const {rows : productos} = await pool.query('SELECT * FROM productos;');
	return productos;
};

const getMyProducts = async () => {};

const verifyCrede = async (correo, contrasena) => {
	const values = [correo];
	const query = 'SELECT * FROM usuarios WHERE correo = $1';
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(query, values);
	const { contrasena: contrasenaCrypt } = usuario;
	const saltRounds = 10;
	const contraCrypt = bcrypt.hashSync(contrasenaCrypt, saltRounds);
	const contrasenaCorrecta = bcrypt.compareSync(contrasena, contraCrypt);
	if (!contrasenaCorrecta || !rowCount) {
		throw { code: 401, message: `Email o contraseña incorrecta` };
	}
};

const registrarUsuario = async (usuario) => {
	let { nombre, apellido, correo, contrasena, genero } = usuario;
	const contrasenaCrypt = bcrypt.hashSync(contrasena);
	const values = [nombre, apellido, correo, contrasenaCrypt, genero];
	const query = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4, $5)';
	await pool.query(query, values);
};

module.exports = { getProducts, verifyCrede };
