const express = require('express');
const {
	getProducts,
	getProduct,
	postVerifyCrede,
	postRegistrarU,
	postVender,
	deleteProduct,
	updateProducto,
} = require('./query');
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

app.get('/productos/:id', verifyToken, async (req, res) => {
	const { id } = req.params;
	try {
		const producto = await getProduct(id);
		res.json(producto);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/login', checkCrede, async (req, res) => {
	const { correo, contrasena } = req.body;
	try {
		await postVerifyCrede(correo, contrasena);
		const token = jwt.sign({ correo }, 'key');
		res.send(token);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/registrar', async (req, res) => {
	const usuario = req.body;
	try {
		await postRegistrarU(usuario);
		res.send('Usuario creado con éxito');
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/vender', verifyToken, async (req, res) => {
	const producto = req.body;
	try {
		await postVender(producto);
		res.status(201).send('Producto ingresado exitosamente');
	} catch (error) {
		res.status(500).send(error);
	}
});

app.put('/productos/:id', verifyToken, async (req, res) => {
	const id = req.params.id;
	const producto = req.body;
	try {
		const updatedProducto = await updateProducto(producto, id);

		if (updatedProducto) {
			res.status(200).json(updatedProducto);
		} else {
			res
				.status(404)
				.json({ message: 'No se encontró ningún producto con ese ID.' });
		}
	} catch (error) {
		console.error('Error en la ruta PUT /productos/:id', error);
		res.status(500).json({ message: 'Error al procesar la solicitud.' });
	}
});

app.delete('/productos/:id', verifyToken, async (req, res) => {
	const { id } = req.params;
	try {
		await deleteProduct(id);
		res.send(`El producto ${id} fue eliminado correctamente`);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.use('*', (req, res) => {
	res.status(404).send({ message: 'La ruta que intenta consultar no existe' });
});

module.exports = app;
