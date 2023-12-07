const express = require('express');
const { getProducts, verifyCrede } = require('./query');
const { checkCrede } = require('./middlewares');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morganBody = require('morgan-body');
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server On  ${PORT}`);
});
app.use(cors());
app.use(express.json());

app.get('/productos', async (req, res) => {
	try {
		const productos = await getProducts();
		res.json(productos);
	} catch (error) {
		res.status.send(error);
	}
});

app.post('/login', checkCrede, async (req, res) => {
	try {
		const { correo, contrasena } = req.body;
		await verifyCrede(correo, contrasena);
		const token = jwt.sign({ correo }, 'key');
		res.send(token);
	} catch (error) {
		res.status(500).send(error);
	}
});
