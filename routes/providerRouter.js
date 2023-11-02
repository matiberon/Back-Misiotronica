import express from 'express'
import autenticacionDeToken from '../middlewares/tokenAuthentication.js'

const providerRouter = express.Router()

import { getAllProviders, getOneProviderById, saveProvider } from '../controllers/providerControllers.js'

providerRouter.get ('/proveedores', autenticacionDeToken, getAllProviders)
providerRouter.get ('/proveedores/:id', autenticacionDeToken, getOneProviderById)
providerRouter.post ('/usuarios/proveedor', autenticacionDeToken, saveProvider)

export default providerRouter