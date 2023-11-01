import db from '../db/connection.js'
import { DataTypes } from 'sequelize'
import Usuario from './usuario.js'

const Cliente = db.define('Cliente', {
	id_cliente: { type: DataTypes.INTEGER, primaryKey: true, field: 'id_cliente',},
	nombre: { type: DataTypes.STRING, allowNull: false,},
	apellido: { type: DataTypes.STRING, allowNull: false,},
	email: { type: DataTypes.STRING, allowNull: false,},
	telefono: { type: DataTypes.INTEGER, allowNull: false,},
	dni: { type: DataTypes.INTEGER, allowNull: false,},
	calle: { type: DataTypes.STRING, allowNull: false,},
	nro: { type: DataTypes.INTEGER, allowNull: false,},
	ciudad: { type: DataTypes.STRING, allowNull: false,},
},
{
	timestamps: false,
	tableName: 'clientes'
})

Cliente.belongsTo(Usuario, {
	foreignKey: 'id_cliente',
	onDelete: 'CASCADE',
})

Usuario.hasOne(Cliente, {
	foreignKey: 'id_cliente',
	onDelete: 'CASCADE',
})

export default Cliente