import Administrador from '../models/administrador.js'
import Usuario from '../models/usuario.js'

// Obtener todos los administradores. Permitido solo para los administradores.
export async function getAllAdmins(req,res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		const administradores = await Administrador.findAll()

		res.status(200).json(administradores)
	} catch(error) {
		res.status(204).json({'message': error})
	}   
}

// Obtener los datos de un Administrador en particular segun su id. Permitido solo para los administradores.
export async function getOneAdminById (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		let administradorId = parseInt(req.params.id)
		let administradorEncontrado = await Administrador.findByPk(administradorId)
	
		if (!administradorEncontrado) {
			res.status(404).json({ message: 'Administrador no encontrado' })
		} else {
			res.status(200).json(administradorEncontrado)
		}
	} catch (error) {
		res.status(500).json({ message: 'Ocurrió un error al buscar el administrador', error: error })
	}   
}

// Crear un nuevo USUARIO-ADMINISTRADOR. Permitido solo para los administradores.
export async function saveAdmin (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		// Crear un nuevo usuario en la tabla Usuario.
		const nuevoUsuario = await Usuario.create({
			nombre_usuario: req.body.nombre_usuario,
			password: req.body.password,
			nivel_usuario: 3,
		})
    
		// Obtener el id_usuario generado para el nuevo usuario.
		const idUsuarioGenerado = nuevoUsuario.id_usuario
    
		// Crear un nuevo administrador en la tabla Administrador y relacionarlo con el id_usuario.
		const nuevoAdministrador = await Administrador.create({
			id_administrador: idUsuarioGenerado,
			nombre: req.body.nombre,
			apellido: req.body.apellido,
			email: req.body.email,
			telefono: req.body.telefono,
		})
    
		res.status(201).json({ message: 'Usuario y administrador creados con éxito', usuario: nuevoUsuario, administrador: nuevoAdministrador })
	} catch (error) {
		console.error('Error al crear usuario y administrador:', error)
		res.status(500).json({ error: 'Error al crear usuario y administrador' })
	}
}