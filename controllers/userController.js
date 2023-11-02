import Usuario from '../models/usuario.js'

// Obtener todos los usuarios. Permitido solo para los administradores.
export async function getAllUsers(req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		const usuarios = await Usuario.findAll()

		res.status(200).json(usuarios)
	} catch(error) {
		res.status(204).json({'message': error})
	}
}

// Obtener los datos de un Usuario en particular segun su id. Permitido solo para los administradores.
export async function getOneUserById (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = await Usuario.findByPk(usuarioId)
	
		if (!usuarioEncontrado) {
			res.status(404).json({ message: 'Usuario no encontrado' })
		} else {
			res.status(200).json(usuarioEncontrado)
		}
	} catch (error) {
		res.status(500).json({ message: 'Ocurrió un error al buscar el usuario', error: error })
	}
}

// Modificar algun atributo de usuario. Permitido solo para administradores.
export async function editUser (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}	
	let idUsuarioAEditar = parseInt(req.params.id)

	try{
		let usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar)

		if (!usuarioAActualizar) {
			res.status(204).json({'message':'Usuario no encontrado'})
		}
		await usuarioAActualizar.update(req.body)

		res.status(200).send('Usuario actualizado.')

	} catch (error){
		res.status(204).json({'message':'Usuario no encontrado.'})
	}
}

// Eliminar un usuario de la base de datos segun su id (tambien elimina el Administrador/Cliente/Proveedor asociado). Permitido solo para administradores.
export async function deleteUser (req, res) {
	if (req.nivelDelUsuario ==1){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		const idUsuarioABorrar = req.params.id
	
		// Busca el usuario por su ID
		const usuarioABorrar = await Usuario.findByPk(idUsuarioABorrar)
	
		if (!usuarioABorrar) {
			return res.status(404).json({ message: 'Usuario no encontrado' })
		}
	
		// Elimina el usuario y su cliente asociado
		await usuarioABorrar.destroy()
	
		res.status(200).json({ message: 'Usuario eliminado con éxito' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error en el servidor' })
	}
}