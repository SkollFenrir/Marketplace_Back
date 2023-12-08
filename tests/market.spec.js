const request = require('supertest');
const server = require('../index');
const jwt = require('jsonwebtoken');

describe('Test a rutas de Marketplace', () => {
	it('Obteniendo status 404 de una ruta inexistente ', async () => {
		const response = await request(server).get('/noexiste').send();
		expect(response.statusCode).toBe(404);
	});

	it('Obteniendo status 200, tipo de dato y con al menos 1 objeto ', async () => {
		const token = jwt.sign({ correo: 'Jhon.Doe@gmail.com' }, 'key', {
			expiresIn: '1h',
		});
		const response = await request(server)
			.get('/productos')
			.set('Authorization', `Bearer ${token}`)
			.send();
		expect(response.statusCode).toBe(200);
		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBeGreaterThan(0);
	});

	it('Producto ingresado', async () => {
		const token = jwt.sign({ correo: 'Jhon.Doe@gmail.com' }, 'key', {
			expiresIn: '1h',
		});
		const producto = {
			usuario_id: 3,
			titulo: 'test',
			descripcion: 'prueba',
			url_img: 'prueba tests',
			precio: 6969,
			estado: 'true',
		};
		const { statusCode } = await request(server)
			.post('/vender')
			.set('Authorization', `Bearer ${token}`)
			.send(producto);
		expect(statusCode).toBe(201);
	});

	it('Obteniendo un status 404', async () => {
		const token = jwt.sign({ correo: 'Jhon.Doe@gmail.com' }, 'key', {
			expiresIn: '1h',
		});
		const firstId = Math.floor(Math.random() * 999);
		const producto = { precio: 22222, estado: false };
		const { statusCode } = await request(server)
			.put(`/productos/${firstId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(producto);

		expect(statusCode).toBe(404);
	});
});
