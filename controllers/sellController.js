import Venta from '../models/venta.js'

// Obtener todas las ventas. Permitido solo para los administradores.
export async function getAllSells(req, res) {
	if (req.nivelDelUsuario !==3){
		return res.status(401).json({' message ': 'No tiene permisos para esta accion.'})
	}
	try {
		const ventas = await Venta.findAll()

		res.status(200).json(ventas)
	} catch(error) {
		res.status(204).json({'message': error})
	}    
}

// Obtener los datos de una Venta en particular segun su id. Permitido para cualquier usuario.
export async function getOneSellById (req, res) {
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
}