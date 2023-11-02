import express from 'express'
import autenticacionDeToken from '../middlewares/tokenAuthentication.js'

const adminRouter = express.Router()

import { getAllAdmins, getOneAdminById, saveAdmin } from '../controllers/adminController.js'

adminRouter.get('/administradores', autenticacionDeToken, getAllAdmins)
adminRouter.get('/administradores/:id', autenticacionDeToken, getOneAdminById)
adminRouter.post('/usuarios/administrador', autenticacionDeToken, saveAdmin)

export default adminRouter