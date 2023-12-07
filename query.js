const { query } = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	contrasena: 'postgres',
	database: 'marketplace',
	allowExitOnIdle: true,
});

const getProducts = async () => {
	const query = 'SELECT * FROM productos';
	const result = await pool.query(query);
	const [productos] = result.rows;
	return productos;
};

const getMyProducts = async () => {};

const verifyCrede = async (correo, contrasena) => {
	const values = [correo];
	const consulta = 'SELECT * FROM usuarios WHERE correo = $1';
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(consulta, values);
	const { contrasena: contrasenaCrypt } = usuario;
	const contrasenaCorrecta = bcrypt.compareSync(contrasena, contrasenaCrypt);
	if (!contrasenaCorrecta || !rowCount) {
		throw { code: 401, message: 'Email o contraseña incorrecta' };
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
