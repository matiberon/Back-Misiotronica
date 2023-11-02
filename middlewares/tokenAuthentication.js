import jwt from 'jsonwebtoken'

//Middleware para la autenticacion de token recibido.
function autenticacionDeToken(req, res, next){
	const headerAuthorization = req.headers['authorization']

	const tokenRecibido = headerAuthorization.split(' ')[1]

	if (tokenRecibido == null){
		return res.status(401).json({message: 'Token invalido.'})
	}

	let payload = null 

	try {
		//Intentamos sacar los datos del payload del token.
		payload = jwt.verify(tokenRecibido, process.env.SECRET_KEY)
	} catch (error) {
		return res.status(401).json({message: 'Token invalido.'})
	}

	if (Date.now() > payload.exp){
		return res.status(401).json({message: 'Token caducado.'})
	}

	//Pasadas las validaciones.
	req.user = payload.sub
	req.nivelDelUsuario = payload.nivel

	next()
}

export default autenticacionDeToken