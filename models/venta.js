import db from '../db/connection.js'
import { DataTypes } from 'sequelize'
import Carrito from './carrito.js'
import Producto from './producto.js'

const Venta = db.define('Venta', {
	id_venta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
	id_carrito: { type: DataTypes.INTEGER, field: 'id_carrito',},
	id_producto: { type: DataTypes.INTEGER, field: 'id_producto',},
	precio_producto: { type: DataTypes.FLOAT, allowNull: false,},
	cantidad: { type: DataTypes.INTEGER, allowNull: false,},
	subtotal: { type: DataTypes.FLOAT, allowNull: false,},
},
{
	timestamps:false,
	tableName: 'ventas'
})

Venta.belongsTo(Producto , {
	foreignKey: 'id_producto',
	onDelete: 'CASCADE',
})

Carrito.hasMany(Venta, {
	foreignKey: 'id_producto',
})

Venta.belongsTo(Carrito , {
	foreignKey: 'id_carrito',
	onDelete: 'CASCADE',
})

Carrito.hasMany(Venta, {
	foreignKey: 'id_carrito',
})

export default Venta