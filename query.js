const { query } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: '',
	allowExitOnIdle: true,
});

const getProducts = async () => {
	const query = 'SELECT * FROM productos';
	const result = await pool.query(query);
	const [productos] = result.rows;
	return productos;
};

const getMyProducts = async () =>{
    
}

const verifyCrede = async (email, password) => {
	const values = [email];
	const consulta = 'SELECT * FROM usuarios WHERE email = $1';
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(consulta, values);
	const { password: passwordCrypt } = usuario;
	const passwordCorrecta = bcrypt.compareSync(password, passwordCrypt);
	if (!passwordCorrecta || !rowCount) {
		throw { code: 401, message: 'Email o contraseña incorrecta' };
	}
};

const registrarUsuario = async (usuario) => {
	let { nombre, apellido, email, password, genero} = usuario;
	const passwordCrypt = bcrypt.hashSync(password);
	const values = [nombre, apellido, email, passwordCrypt, genero];
	const query = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4, $5)';
	await pool.query(query, values);
};