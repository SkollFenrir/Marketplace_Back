const express = require('express');
const { getProducts, verifyCrede, registrarUsuario, getProduct } = require('./query');
const { checkCrede, verifyToken } = require('./middlewares');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morganBody = require('morgan-body');
const app = express();
const PORT = 3000;

morganBody(app);

app.listen(PORT, () => {
	console.log(`Server On ${PORT}`);
});
app.use(cors());
app.use(express.json());

app.get('/productos', verifyToken, async (req, res) => {
	try {
		const productos = await getProducts();
		res.json(productos);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.get('/productos/:id', verifyToken, async(req, res)=>{
	try {
		const {id} = req.params;
		const producto = await getProduct(id)
		res.json(producto)
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
})

app.post('/login', checkCrede, async (req, res) => {
	try {
		const { correo, contrasena } = req.body;
		await verifyCrede(correo, contrasena);
		const token = jwt.sign({ correo }, 'key');
		res.send(token);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.post('/registrar', async (req, res) => {
	try {
		const usuario = req.body;
		await registrarUsuario(usuario);
		res.send('Usuario creado con éxito');
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});
