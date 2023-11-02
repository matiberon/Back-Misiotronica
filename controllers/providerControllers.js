import Proveedor from '../models/proveedor.js'
import Usuario from '../models/usuario.js'

// Obtener todos los proveedores. Permitido solo para los administradores.
export async function getAllProviders(req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}	
	try {
		const proveedores = await Proveedor.findAll()

		res.status(200).json(proveedores)
	} catch(error) {
		res.status(204).json({'message': error})
	}   
}

// Obtener los datos de un Proveedor en particular segun su id. Permitido solo para los administradores.
export async function getOneProviderById (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		let proveedorId = parseInt(req.params.id)
		let proveedorEncontrado = await Proveedor.findByPk(proveedorId)
	
		if (!proveedorEncontrado) {
			res.status(404).json({ message: 'Proveedor no encontrado' })
		} else {
			res.status(200).json(proveedorEncontrado)
		}
	} catch (error) {
		res.status(500).json({ message: 'Ocurrió un error al buscar el proveedor', error: error })
	}
}

// Crear un nuevo USUARIO-PROVEEDOR. Permitido solo para los administradores.
export async function saveProvider (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		// Crear un nuevo usuario en la tabla Usuario.
		const nuevoUsuario = await Usuario.create({
			nombre_usuario: req.body.nombre_usuario,
			password: req.body.password,
			nivel_usuario: 2,
		})

		// Obtener el id_usuario generado para el nuevo usuario.
		const idUsuarioGenerado = nuevoUsuario.id_usuario

		// Crear un nuevo proveedor en la tabla Proveedores y relacionarlo con el id_usuario.
		const nuevoProveedor = await Proveedor.create({
			id_proveedor: idUsuarioGenerado,
			razon_social: req.body.razon_social,
			email: req.body.email,
			telefono: req.body.telefono,
			cuit: req.body.cuit,
			calle: req.body.calle,
			nro: req.body.nro,
			ciudad: req.body.ciudad,
		})

		res.status(201).json({ message: 'Usuario y proveedor creados con éxito', usuario: nuevoUsuario, proveedor: nuevoProveedor })
	} catch (error) {
		console.error('Error al crear usuario y proveedor:', error)
		res.status(500).json({ error: 'Error al crear usuario y proveedor' })
	}
}