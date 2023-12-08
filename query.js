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

const getProduct = async (id) => {
	const formatQuery = format('SELECT * FROM productos WHERE id = %s', id);
	const { rows: producto } = await pool.query(formatQuery);
	return producto;
};

const getMyProducts = async () => {};

const postVender = async (producto) => {
	let { usuario_id, titulo, descripcion, url_img, precio, estado } = producto;
	const formatQuery = format(
		'INSERT INTO productos VALUES (DEFAULT, %s, %L, %L, %L, %s, %L)',
		usuario_id,
		titulo,
		descripcion,
		url_img,
		precio,
		estado
	);
	await pool.query(formatQuery);
};
const postVerifyCrede = async (correo, contrasena) => {
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

const postRegistrarU = async (usuario) => {
	const saltRounds = 10;
	let { nombre, apellido, correo, contrasena, genero } = usuario;
	const contrasenaCrypt = bcrypt.hashSync(contrasena, saltRounds);
	const formatQuery = format(
		'INSERT INTO usuarios VALUES (DEFAULT, %L, %L, %L, %L, %L)',
		nombre,
		apellido,
		correo,
		contrasenaCrypt,
		genero
	);
	await pool.query(formatQuery);
};

const updateProducto = async (producto, id) => {
	let { precio, estado } = producto;
	const formatQuery = format(
		'UPDATE productos SET precio = %L, estado = %L WHERE id = %s RETURNING *',
		precio,
		estado,
		id
	);
	
	try {
		const result = await pool.query(formatQuery);
		if (result.rows.length > 0) {
			return result.rows[0];
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error al actualizar el producto:', error);
		throw {
			code: error.code,
			message: error.message,
			detail: error.detail,
		};
	}
};

const deleteProduct = async (id) => {
	const formatQuery = format('DELETE FROM productos WHERE id = %s', id);
	await pool.query(formatQuery);
};

module.exports = {
	getProducts,
	getProduct,
	postVerifyCrede,
	postRegistrarU,
	postVender,
	updateProducto,
	deleteProduct,
};
