import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Usuario = db.define('Usuario', {
	id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
	nombre_usuario: { type: DataTypes.STRING, allowNull: false,},
	password: { type: DataTypes.STRING, allowNull: false,},
	nivel_usuario: { type: DataTypes.INTEGER, allowNull: false,},
},
{
	timestamps: false,
	tableName: 'usuarios'
})

export default Usuario