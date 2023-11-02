import Carrito from '../models/carrito.js'
import Producto from '../models/producto.js'
import Venta from '../models/venta.js'

// Obtener todos los carritos. Permitido solo para los administradores.
export async function getAllCarts (req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		const carritos = await Carrito.findAll()

		res.status(200).json(carritos)
	} catch(error) {
		res.status(204).json({'message': error})
	}   
}

// Obtener los datos de un Carrito en particular segun su id. Permitido para cualquier usuario.
export async function getOneCartById (req, res) {
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
}

// Crear un nuevo carrito y venta. Permitido para cualquier usuario.
export async function saveCart (req, res) {
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
}