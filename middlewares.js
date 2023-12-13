const jwt = require('jsonwebtoken');

const checkCrede = (req, res, next) => {
	const { correo, contrasena } = req.body;
	if (!correo || !contrasena) {
		res.status(401).send({ message: 'No se recibieron las credenciales' });
		return
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
	try {
		const decoded = jwt.verify(token, 'key');
		req.correoUsuario = decoded.correo
		next();
	} catch (error) {
		res.status(401).json({ error: 'El token es inválido' })
	}
	

	
};

module.exports = { checkCrede, verifyToken };
