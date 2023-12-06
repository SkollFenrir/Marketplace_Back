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
