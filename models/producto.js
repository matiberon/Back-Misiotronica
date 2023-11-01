import db from '../db/connection.js'
import { DataTypes } from 'sequelize'
import Proveedor from './proveedor.js'

const Producto = db.define('Producto', {
	id_producto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
	nombre_producto: { type: DataTypes.STRING, allowNull: false,},
	precio: { type: DataTypes.FLOAT, allowNull: false},
	stock: { type: DataTypes.INTEGER},
	id_proveedor: { type: DataTypes.INTEGER, field: 'id_proveedor',},
},
{
	tableName:'productos',
	timestamps: false
})

Producto.belongsTo(Proveedor, {
	foreignKey: 'id_proveedor',
})
  
Proveedor.hasMany(Producto, {
	foreignKey: 'id_proveedor',
})

export default Producto
