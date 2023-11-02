import Producto from '../models/producto.js'
import Proveedor from '../models/proveedor.js'

// Obtener todos los productos. Permitido para cualquier usuario.
export async function getAllProducts (req,res) {
	try {
		const productos = await Producto.findAll()

		res.status(200).json(productos)
	} catch(error) {
		res.status(204).json({'message': error})
	}   
}

// Obtener los datos de un Producto en particular segun su id. Permitido para cualquier usuario.
export async function getOneProductById (req, res) {
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
}

// Crear un nuevo producto. Permitido para los proveedores y administradores.
export async function saveProduct (req, res) {
	if (req.nivelDelUsuario ==1){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		const nuevoProducto = req.body
	
		// Comprobar que el proveedor exista en la base de datos
		const proveedorExistente = await Proveedor.findByPk(nuevoProducto.id_proveedor)
	
		if (!proveedorExistente) {
			return res.status(400).json({ message: 'Proveedor no encontrado' })
		}
	
		// Crea el nuevo producto asociado al proveedor
		const productoCreado = await Producto.create(nuevoProducto)
		await productoCreado.setProveedor(proveedorExistente)
	
		res.status(201).json({ message: 'Producto creado con éxito', producto: productoCreado })
	} catch (error) {
		console.error('Error al crear el producto:', error)
		res.status(500).json({ error: 'Error al crear el producto' })
	}
}

// Modificar el stock de un producto. Permitido para administradores o proveedores.
export async function editProductStock (req, res) {
	if (req.nivelDelUsuario ==1){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		let idProductoAEditar = req.body.id_producto
  
		if (!idProductoAEditar) {
			return res.status(400).json({ 'message': 'ID de producto no válido' })
		}
  
		const productoAActualizar = await Producto.findByPk(idProductoAEditar)
  
		if (!productoAActualizar) {
			return res.status(204).json({ 'message': 'Producto no encontrado' })
		}
  
		// Agregar mensajes de registro para seguir el valor de stock
		console.log('Stock antes de la actualización:', productoAActualizar.stock)
  
		if (req.body.aumentarStock !== undefined) {
			console.log('Valor de req.body.aumentarStock:', req.body.aumentarStock)
			productoAActualizar.stock += req.body.aumentarStock
  
			// Agregar otro mensaje de registro después de la actualizacion
			console.log('Stock después de la actualización:', productoAActualizar.stock)
		}
  
		await productoAActualizar.save()
  
		res.status(200).send('Stock actualizado.')
	} catch (error) {
		console.error('Error al actualizar el stock del producto:', error)
		res.status(500).json({ 'message': 'Error en el servidor' })
	}
}