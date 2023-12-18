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

const getUsuarioId = async (correoUsuario) => {
	try {
		const formatQuery = format(
			'SELECT id FROM usuarios WHERE correo = %L',
			correoUsuario
		);
		const {
			rows: [{ id }],
		} = await pool.query(formatQuery);
		return id;
	} catch (error) {
		console.error('Error al verificar la existencia del producto:', error);
		throw {
			code: 404,
			message: 'No se encontró ningún usuario con ese CORREO',
		};
	}
};

const getUser = async (correoUsuario) => {
	const formatQuery = format(
		'SELECT * FROM usuarios WHERE correo = %L',
		correoUsuario
	);
	const { rows: user } = await pool.query(formatQuery);
	return user;
};

const getProducts = async () => {
	const { rows: productos } = await pool.query('SELECT * FROM productos;');
	return productos;
};

const getProduct = async (id) => {
	const formatQuery = format('SELECT * FROM productos WHERE id = %s', id);
	const { rows: producto } = await pool.query(formatQuery);
	return producto;
};

const getMyProducts = async (correoUsuario) => {
	const formatQuery = format(
		'SELECT * FROM productos WHERE usuario_id = (SELECT id FROM usuarios WHERE correo = %L)',
		correoUsuario
	);
	const { rows: myProducts } = await pool.query(formatQuery);
	return myProducts;
};

const postVender = async (producto, correoUsuario) => {
	let { titulo, descripcion, url_img, precio, estado } = producto;
	const usuario_id = await getUsuarioId(correoUsuario);
	const formatQuery = format(
		'INSERT INTO productos (id, usuario_id, titulo, descripcion, url_img, precio, estado) VALUES (DEFAULT, %s, %L, %L, %L, %s, %L)',
		usuario_id,
		titulo,
		descripcion,
		url_img,
		precio,
		estado
	);
	await pool.query(formatQuery);
};

const postMiFav = async (productoId, correoUsuario) => {
	const usuarioId = await getUsuarioId(correoUsuario);
	const formatQuery = format(
		'INSERT INTO mis_favoritos (id, usuario_id, producto_id) VALUES (DEFAULT, %s, %s)',
		usuarioId,
		productoId
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
		'INSERT INTO usuarios (id, nombre, apellido, correo, contrasena, genero) VALUES (DEFAULT, %L, %L, %L, %L, %L)',
		nombre,
		apellido,
		correo,
		contrasenaCrypt,
		genero
	);
	await pool.query(formatQuery);
};

const checkProductExists = async (productId) => {
	try {
		const formatQuery = format(
			'SELECT 1 FROM productos WHERE id = %s',
			productId
		);
		const result = await pool.query(formatQuery);
		return result.rows.length > 0;
	} catch (error) {
		console.error('Error al verificar la existencia del producto:', error);
		throw { code: 500, message: 'Error interno del servidor' };
	}
};

const updateProducto = async (producto, id) => {
	let { precio, estado } = producto;
	const formatQuery = format(
		'UPDATE productos SET precio = %L, estado = %L WHERE id = %s RETURNING *',
		precio,
		estado,
		id
	);
	const productExists = await checkProductExists(id);
	if (!productExists) {
		throw { code: 404, message: 'No se encontró ningún producto con ese ID' };
	}
	await pool.query(formatQuery);
};

const deleteMyFav = async (productId, correoUsuario) => {
	const usuarioId = await getUsuarioId(correoUsuario);
	const formatQuery = format(
		'DELETE FROM mis_favoritos WHERE usuario_id = %s AND producto_id = %s',
		usuarioId,
		productId
	);
	await pool.query(formatQuery);
};

const deleteProduct = async (id) => {
	const productExists = await checkProductExists(id);
	if (!productExists) {
		throw { code: 404, message: 'No se encontró ningún producto con ese ID' };
	}
	const formatQuery = format('DELETE FROM productos WHERE id = %s', id);
	await pool.query(formatQuery);
};

module.exports = {
	getProducts,
	getUser,
	getProduct,
	postVerifyCrede,
	postRegistrarU,
	postVender,
	postMiFav,
	updateProducto,
	deleteProduct,
	getMyProducts,
	deleteMyFav,
};
