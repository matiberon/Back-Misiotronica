import Cliente from '../models/cliente.js'
import Usuario from '../models/usuario.js'

// Obtener todos los clientes. Permitido solo para los administradores.
export async function getAllClients(req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		const clientes = await Cliente.findAll()

		res.status(200).json(clientes)
	} catch(error) {
		res.status(204).json({'message': error})
	}    
}

// Obtener los datos de un Cliente en particular segun su id. Permitido solo para los administradores.
export async function getOneClientById (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		let clienteId = parseInt(req.params.id)
		let clienteEncontrado = await Cliente.findByPk(clienteId)
	
		if (!clienteEncontrado) {
			res.status(404).json({ message: 'Cliente no encontrado' })
		} else {
			res.status(200).json(clienteEncontrado)
		}
	} catch (error) {
		res.status(500).json({ message: 'Ocurrió un error al buscar el cliente', error: error })
	}    
}

// Crear un nuevo USUARIO-CLIENTE. Permitido para cualquier usuario.
export async function saveClient (req, res) {
	try {
		// Crear un nuevo usuario en la tabla Usuario
		const nuevoUsuario = await Usuario.create({
			nombre_usuario: req.body.nombre_usuario,
			password: req.body.password,
			nivel_usuario: 1,
		})

		// Obtener el id_usuario generado para el nuevo usuario
		const idUsuarioGenerado = nuevoUsuario.id_usuario

		// Crear un nuevo cliente en la tabla Cliente y relacionarlo con el id_usuario
		const nuevoCliente = await Cliente.create({
			id_cliente: idUsuarioGenerado,
			nombre: req.body.nombre,
			apellido: req.body.apellido,
			email: req.body.email,
			telefono: req.body.telefono,
			dni: req.body.dni,
			calle: req.body.calle,
			nro: req.body.nro,
			ciudad: req.body.ciudad,
		})

		res.status(201).json({ message: 'Usuario y cliente creados con éxito', usuario: nuevoUsuario, cliente: nuevoCliente })
	} catch (error) {
		console.error('Error al crear usuario y cliente:', error)
		res.status(500).json({ error: 'Error al crear usuario y cliente' })
	}   
}