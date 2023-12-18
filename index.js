const express = require('express');
const {
	getProducts,
	getProduct,
	postVerifyCrede,
	postRegistrarU,
	postVender,
	deleteProduct,
	updateProducto,
	getMyProducts,
	postMiFav,
	deleteMyFav,
	getUser,
} = require('./query');
const { checkCrede, verifyToken } = require('./middlewares.js');
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

app.get('/gallery', /* verifyToken */ async (req, res) => {
	try {
		const productos = await getProducts();
		res.json(productos);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.get('/profile', verifyToken, async (req, res) =>{
	const correoUsuario = req.correoUsuario;
	console.log(correoUsuario)
	try {
		const user = await getUser(correoUsuario)
		res.json(user)
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
})

app.get('/product/:id', verifyToken, async (req, res) => {
	const { id } = req.params;
	try {
		const producto = await getProduct(id);
		res.json(producto);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get('/my-products', verifyToken, async (req, res) => {
	const correoUsuario = req.correoUsuario;
	try {
		const myProducts = await getMyProducts(correoUsuario);
		res.json(myProducts);
	} catch (error) {
		res.status(500).send();
	}
});

app.post('/login', checkCrede, async (req, res) => {
	const { correo, contrasena } = req.body;
	try {
		await postVerifyCrede(correo, contrasena);
		const token = jwt.sign(
			{ correo },
			'key' /*  {
			expiresIn: '1h',
		} */
		);
		res.send(token);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/product/:id', verifyToken, async (req, res) => {
	const productoId = req.params.id;
	const correoUsuario = req.correoUsuario;
	try {
		await postMiFav(productoId, correoUsuario);
		res.send('Producto agregado a favoritos');
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/register', async (req, res) => {
	const usuario = req.body;
	try {
		await postRegistrarU(usuario);
		res.send('Usuario creado con éxito');
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/sell', verifyToken, async (req, res) => {
	const producto = req.body;
	const correoUsuario = req.correoUsuario;
	try {
		await postVender(producto, correoUsuario);
		res.status(201).send('Producto ingresado exitosamente');
	} catch (error) {
		res.status(500).send(error);
	}
});

app.put('/product/:id', verifyToken, async (req, res) => {
	const id = req.params.id;
	const producto = req.body;
	try {
		await updateProducto(producto, id);
		res.send(`El producto con ID: ${id}, fue modificado exitosamente.`);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.delete('/product/:id', verifyToken, async (req, res) => {
	const productoId = req.params.id;
	const correoUsuario = req.correoUsuario;
	try {
		await deleteMyFav(productoId, correoUsuario);
		res.send(`Producto con ID: ${productoId}, eliminado de favoritos`);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.delete('/myProducts/:id', verifyToken, async (req, res) => {
	const { id } = req.params;
	try {
		await deleteProduct(id);
		res.send(`El producto con ID: ${id}, fue eliminado correctamente`);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.use('*', (req, res) => {
	res.status(404).send({ message: 'La ruta que intenta consultar no existe' });
});

module.exports = app;
