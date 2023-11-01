import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import express from 'express'
import jwt from 'jsonwebtoken'

import db from './db/connection.js'
import Usuario from './models/usuario.js'
import Administrador from './models/administrador.js'
import Proveedor from './models/proveedor.js'
import Cliente from './models/cliente.js'
import Producto from './models/producto.js'
import Carrito from './models/carrito.js'
import Venta from './models/venta.js'

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li></ul>'

const app = express()

const expossedPort = 1234

function autenticacionDeToken(req, res, next){
	const headerAuthorization = req.headers['authorization']

	const tokenRecibido = headerAuthorization.split(' ')[1]

	if (tokenRecibido == null){
		return res.status(401).json({message: 'Token invalido.'})
	}

	let payload = null 

	try {
		payload = jwt.verify(tokenRecibido, process.env.SECRET_KEY)
	} catch (error) {
		return res.status(401).json({message: 'Token invalido.'})
	}

	if (Date.now() > payload.exp){
		return res.status(401).json({message: 'Token caducado.'})
	}

	req.user = payload.sub

	next()
}

app.use((req, res, next) =>{
	if ((req.method !== 'POST') && (req.method !== 'PATCH')) { return next()}

	if (req.headers['content-type'] !== 'application/json') { return next()}

	let bodyTemporal = ''

	req.on('data', (chunk) => {
		bodyTemporal += chunk.toString()
	})

	req.on('end', () => {
		req.body = JSON.parse(bodyTemporal)

		next()
	})})


app.get('/', (req, res) => {
	res.status(200).send(html)
})

app.post('/auth', async (req,res) => {

	const usuarioABuscar = req.body.usuario
	const passwordRecibido = req.body.password

	let usuarioEncontrado = ''

	try {
		usuarioEncontrado = await Usuario.findAll({where:{usuario:usuarioABuscar}})

		if (usuarioEncontrado == ''){
			return res.status(400).json({message: 'Usuario no encontrado.'})  
		}
	} catch(error){
		return res.status(400).json({message: 'Usuario no encontrado.'})
	}

	if (usuarioEncontrado[0].password !== passwordRecibido) {
		return res.status(400).json({message: 'Contraseña incorrecta.'})
	}

	const sub = usuarioEncontrado[0].id
	const usuario = usuarioEncontrado[0].usuario
	const nivel = usuarioEncontrado[0].nivel

	const token = jwt.sign({
		sub,
		usuario,
		nivel,
		exp: Date.now() + (60 * 1000)
	}, process.env.SECRET_KEY)

	res.status(200).json({accessToken: token })
})

app.get('/', (req, res) => {
	res.status(200).send(html)
})

//Obtener todos los usuarios.
app.get('/usuarios', async (req, res) => {
	try {
		const usuarios = await Usuario.findAll()

		res.status(200).json(usuarios)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})

//Obtener todos los administradores.
app.get('/administradores', async (req,res) => {
	try {
		const administradores = await Administrador.findAll()

		res.status(200).json(administradores)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})

//Obtener todos los proveedores.
app.get('/proveedores', async (req,res) => {
	try {
		const proveedores = await Proveedor.findAll()

		res.status(200).json(proveedores)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})

//Obtener todos los clientes.
app.get('/clientes', async (req,res) => {
	try {
		const clientes = await Cliente.findAll()

		res.status(200).json(clientes)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})

//Obtener todos los productos.
app.get('/productos', async (req, res) => {
	try {
		const productos = await Producto.findAll()

		res.status(200).json(productos)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})

//Obtener todos los carritos.
app.get('/carritos', async (req, res) => {
	try {
		const carritos = await Carrito.findAll()

		res.status(200).json(carritos)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})

//Obtener todas las ventas.
app.get('/ventas', async (req, res) => {
	try {
		const ventas = await Venta.findAll()

		res.status(200).json(ventas)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})

//Obtener los datos de un Usuario en particular segun su id.
app.get('/usuarios/:id', async (req,res) => {
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
})

//Obtener los datos de un Administrador en particular segun su id.
app.get('/administradores/:id', async (req,res) => {
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
})

//Obtener los datos de un Proveedor en particular segun su id.
app.get('/proveedores/:id', async (req,res) => {
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
})

//Obtener los datos de un Cliente en particular segun su id.
app.get('/clientes/:id', async (req,res) => {
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
})

//Obtener los datos de un Producto en particular segun su id.
app.get('/productos/:id', async (req,res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = await Producto.findByPk(productoId)
	
		if (!productoEncontrado) {
			res.status(404).json({ message: 'Producto no encontrado' })
		} else {
			res.status(200).json(productoEncontrado)
		}
	} catch (error) {
		res.status(500).json({ message: 'Ocurrió un error al buscar el producto', error: error })
	}
})

//Obtener los datos de un Carrito en particular segun su id.
app.get('/carritos/:id', async (req,res) => {
	try {
		let carritoId = parseInt(req.params.id)
		let carritoEncontrado = await Carrito.findByPk(carritoId)
	
		if (!carritoEncontrado) {
			res.status(404).json({ message: 'Carrito no encontrado' })
		} else {
			res.status(200).json(carritoEncontrado)
		}
	} catch (error) {
		res.status(500).json({ message: 'Ocurrió un error al buscar el carrito', error: error })
	}
})

//Obtener los datos de una Venta en particular segun su id.
app.get('/ventas/:id', async (req,res) => {
	try {
		let ventaId = parseInt(req.params.id)
		let ventaEncontrado = await Venta.findByPk(ventaId)
	
		if (!ventaEncontrado) {
			res.status(404).json({ message: 'Venta no encontrada' })
		} else {
			res.status(200).json(ventaEncontrado)
		}
	} catch (error) {
		res.status(500).json({ message: 'Ocurrió un error al buscar la venta', error: error })
	}
})

//Crear un nuevo USUARIO-ADMINISTRADOR.
app.post('/usuarios/administrador', async (req, res) => {
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
})

//Crear un nuevo USUARIO-PROVEEDOR
app.post('/usuarios/proveedor', async (req, res) => {
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
})

//Crear un nuevo USUARIO-CLIENTE
app.post('/usuarios/cliente', async (req, res) => {
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
})

//Crear un nuevo producto.
app.post('/productos', async (req,res) => {
	try {
		const nuevoProducto = req.body
	
		//Asegurate de que el proveedor exista en la base de datos
		const proveedorExistente = await Proveedor.findByPk(nuevoProducto.id_proveedor)
	
		if (!proveedorExistente) {
			return res.status(400).json({ message: 'Proveedor no encontrado' })
		}
	
		//Crea el nuevo producto y asócialo al proveedor
		const productoCreado = await Producto.create(nuevoProducto)
		await productoCreado.setProveedor(proveedorExistente)
	
		res.status(201).json({ message: 'Producto creado con éxito', producto: productoCreado })
	} catch (error) {
		console.error('Error al crear el producto:', error)
		res.status(500).json({ error: 'Error al crear el producto' })
	}
})
	
//Crear un nuevo carrito y venta.
app.post('/carrito', async (req, res) => {
	try {
		// Obtener los datos del cuerpo de la solicitud
		const { id_cliente, productos } = req.body
	
		// Crear un nuevo carrito
		const carrito = await Carrito.create({
			id_cliente,
			monto_total: 0, // Inicialmente, el monto_total es 0
		})
	
		// Iterar sobre los productos y crear ventas
		for (const productoInfo of productos) {
			const { id_producto, cantidad } = productoInfo
			const producto = await Producto.findByPk(id_producto)
	
			if (producto && producto.stock >= cantidad) {
				const subtotal = producto.precio * cantidad
	
				// Crear una venta asociada al carrito
				await Venta.create({
					id_carrito: carrito.id_carrito,
					id_producto,
					precio_producto: producto.precio,
					cantidad,
					subtotal,
				})
	
				// Actualizar el monto total del carrito
				carrito.monto_total += subtotal
				await carrito.save()
	
				// Restar la cantidad comprada del stock del producto
				producto.stock -= cantidad
				await producto.save()
			} else {
			// Manejar el caso en el que no haya suficiente stock
				return res.status(400).json({ message: 'Stock insuficiente para uno o más productos' })
			}
		}
	
		res.status(201).json({ message: 'Carrito y ventas creados exitosamente' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error al crear carrito y ventas' })
	}
})
	
//Modificar algun atributo de usuario.
app.patch('/usuarios/:id', async (req,res) => {
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
})
		
//Eliminar un usuario de la base de datos segun su id (tambien elimina el Administrador/Cliente/Proveedor asociado)
app.delete ('/usuarios/:id', async (req, res) => {
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
})

app.use((req, res) => {
	res.status(404).send('404')
})

try {
	await db.authenticate()
	console.log ('Conexion con la DDBB establecida.')
} catch (error) {
	console.log ('Error de conexion DDBB.')
}

app.listen(expossedPort, () => {
	console.log('Servidor escuchando en http://localhost:' + expossedPort)
})