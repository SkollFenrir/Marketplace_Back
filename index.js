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
	getMyFavorites,
	isFavorite,
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

app.get('/gallery', verifyToken, async (req, res) => {
	try {
		const productos = await getProducts();
		res.json(productos);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.get('/profile', verifyToken, async (req, res) => {
	const correoUsuario = req.correoUsuario;
	try {
		const user = await getUser(correoUsuario);
		res.json(user);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

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
	const { usuario_id } = req.query;
	try {
		const myProducts = await getMyProducts(usuario_id);
		res.json(myProducts);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get('/my-favorites', verifyToken, async (req, res) => {
	const { usuario_id } = req.query;
	try {
		const data = await getMyFavorites(usuario_id);
		res.json(data);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get('/isFavorite', verifyToken, async (req, res)=>{
	const {usuario_id, producto_id} = req.query;
	try {
		const data = await isFavorite(usuario_id, producto_id)
		res.json(data)
	} catch (error) {
		res.status(500).send(error)
	}
})

app.post('/login', checkCrede, async (req, res) => {
	const { correo, contrasena } = req.body;
	try {
		await postVerifyCrede(correo, contrasena);
		const token = jwt.sign({ correo }, 'key', {
			expiresIn: '1h',
		});
		res.send(token);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/product/:id', verifyToken, async (req, res) => {
	const { usuario_id, producto_id } = req.body;
	console.log(usuario_id, producto_id);
	try {
		await postMiFav(producto_id, usuario_id);
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
	try {
		await postVender(producto);
		res.status(201).send('Producto ingresado exitosamente');
	} catch (error) {
		res.status(500).send(error);
	}
});

app.put('/product/:id', verifyToken, async (req, res) => {
	const  {producto_id}  = req.query;
	let { estado } = req.body;
	console.log(producto_id)
	try {
		await updateProducto(estado, producto_id);
		res.send(`El producto con ID: ${producto_id}, fue modificado exitosamente.`);
	} catch ({ code, message }) {
		res.status(code).send(message);
	}
});

app.delete('/product/:id', verifyToken, async (req, res) => {
	const { usuario_id, producto_id } = req.query;
	console.log(usuario_id, producto_id);
	try {
		await deleteMyFav(usuario_id, producto_id);
		res.send(`Producto con ID: ${producto_id}, eliminado de favoritos`);
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
