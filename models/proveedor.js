import db from '../db/connection.js'
import { DataTypes } from 'sequelize'
import Usuario from './usuario.js'

const Proveedor = db.define('Proveedor', {
	id_proveedor: { type: DataTypes.INTEGER, primaryKey: true, field: 'id_proveedor',},
	razon_social: { type: DataTypes.STRING, allowNull: false,},
	email: { type: DataTypes.STRING, allowNull: false,},
	telefono: { type: DataTypes.INTEGER, allowNull: false,},
	cuit: { type: DataTypes.INTEGER, allowNull: false,},
	calle: { type: DataTypes.STRING, allowNull: false,},
	nro: { type: DataTypes.INTEGER, allowNull: false,},
	ciudad: { type: DataTypes.STRING, allowNull: false,},
},
{
	timestamps:false,
	tableName: 'proveedores'
})

Proveedor.belongsTo(Usuario, {
	foreignKey: 'id_proveedor',
	onDelete: 'CASCADE',
})

Usuario.hasOne(Proveedor, {
	foreignKey: 'id_proveedor',
	onDelete: 'CASCADE',
})

export default Proveedor