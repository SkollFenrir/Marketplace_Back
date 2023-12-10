const jwt = require('jsonwebtoken');

const checkCrede = (req, res, next) => {
	const { correo, contrasena } = req.body;
	if (!correo || !contrasena) {
		res.status(401).send({ message: 'No se recibieron las credenciales' });
	}
	next();
};
const verifyToken = (req, res, next) => {
	const token = req.header('Authorization').split('Bearer ')[1];
	if (!token) {
		return res
			.status(404)
			.json({ error: 'El usuario asociado al token no existe' });
	}
	const tokenValido = jwt.verify(token, 'key');
	if (!tokenValido) {
		return res.status(500).json({ error: 'Error al verificar el token' });
	}
	next();
};

module.exports = { checkCrede, verifyToken };
