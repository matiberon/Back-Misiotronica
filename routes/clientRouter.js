import express from 'express'
import autenticacionDeToken from '../middlewares/tokenAuthentication.js'

const clientRouter = express.Router()

import { getAllClients, getOneClientById, saveClient } from '../controllers/clientController.js'

clientRouter.get ('/clientes', autenticacionDeToken, getAllClients)
clientRouter.get ('/clientes/:id', autenticacionDeToken, getOneClientById)
clientRouter.post ('/usuarios/cliente', saveClient)

export default clientRouter