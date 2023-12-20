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

const getUser = async (correoUsuario) => {
	const formatQuery = format(
		'SELECT id, nombre, apellido, correo, genero FROM usuarios WHERE correo = %L',
		correoUsuario
	);
	const { rows: user } = await pool.query(formatQuery);
	return user;
};

const getProducts = async () => {
	const { rows: productos } = await pool.query('SELECT * FROM productos WHERE estado = true;');
	return productos;
};

const getProduct = async (id) => {
	const formatQuery = format('SELECT * FROM productos WHERE id = %s', id);
	const { rows: producto } = await pool.query(formatQuery);
	return producto;
};

const getMyProducts = async (usuario_id) => {
	const formatQuery = format(
		'SELECT * FROM productos WHERE usuario_id = %s',
		usuario_id
	);
	const { rows: myProducts } = await pool.query(formatQuery);
	return myProducts;
};

const getMyFavorites = async (usuario) => {
	const formatQuery = format(
		'SELECT p.id, p.titulo, p.descripcion, p.url_img, p.precio, p.estado FROM mis_favoritos AS mf JOIN productos AS p ON mf.producto_id = p.id WHERE mf.usuario_id = %s',
		usuario
	);
	try {
		const { rows: myFavorites } = await pool.query(formatQuery);
		return myFavorites;
	} catch (error) {
		console.log(error);
	}
};

const postVender = async (producto) => {
	let { usuario_id, titulo, descripcion, url_img, precio, estado } = producto;
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

const postMiFav = async (productoId, usuario_id) => {
	const formatQuery = format(
		'INSERT INTO mis_favoritos (id, usuario_id, producto_id) VALUES (DEFAULT, %s, %s)',
		usuario_id,
		productoId
	);
	try {
		await pool.query(formatQuery);
	} catch (error) {
		console.log(error);
	}
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

const updateProducto = async (estado , productoId) => {
	const formatQuery = format(
		'UPDATE productos SET estado = %L WHERE id = %s RETURNING *',
		estado,
		productoId
	);
	const productExists = await checkProductExists(productoId);
	if (!productExists) {
		throw { code: 404, message: 'No se encontró ningún producto con ese ID' };
	}
	await pool.query(formatQuery);
};

const deleteMyFav = async ( usuario_id,productoId) => {
	const formatQuery = format(
		'DELETE FROM mis_favoritos WHERE usuario_id = %s AND producto_id = %s',
		usuario_id,
		productoId
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
	getMyProducts,
	getMyFavorites,
	postVerifyCrede,
	postRegistrarU,
	postVender,
	postMiFav,
	updateProducto,
	deleteProduct,
	deleteMyFav,
};
