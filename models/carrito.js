import db from '../db/connection.js'
import { DataTypes } from 'sequelize'
import Cliente from './cliente.js'

const Carrito = db.define('Carrito', {
	id_carrito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
	id_cliente: { type: DataTypes.INTEGER, field: 'id_cliente',},
	monto_total: { type: DataTypes.FLOAT, allowNull: false,},
},
{
	timestamps:false,
	tableName: 'carrito'
})

Carrito.belongsTo(Cliente, {
	foreignKey: 'id_cliente',
	onDelete: 'CASCADE',
})
export default Carrito