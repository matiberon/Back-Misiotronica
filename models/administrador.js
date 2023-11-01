import db from '../db/connection.js'
import { DataTypes } from 'sequelize'
import Usuario from './usuario.js'

const Administrador = db.define('Administrador', {
	id_administrador: { type: DataTypes.INTEGER, primaryKey: true, references: { model: 'Usuarios', key: 'id_usuario'},},
	nombre: { type: DataTypes.STRING, allowNull: false,},
	apellido: { type: DataTypes.STRING, allowNull: false,},
	email: { type: DataTypes.STRING, allowNull: false,},
	telefono: { type: DataTypes.INTEGER, allowNull: false,},
},
{
	timestamps:false,
	tableName: 'administradores'
})

Administrador.belongsTo(Usuario, {
	foreignKey: 'id_administrador',
	onDelete: 'CASCADE',
})

Usuario.hasOne(Administrador, {
	foreignKey: 'id_administrador',
	onDelete: 'CASCADE',
})

export default Administrador