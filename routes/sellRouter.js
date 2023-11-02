import express from 'express'
import autenticacionDeToken from '../middlewares/tokenAuthentication.js'

const sellRouter = express.Router()

import { getAllSells, getOneSellById } from '../controllers/sellController.js'

sellRouter.get ('/ventas', autenticacionDeToken, getAllSells)
sellRouter.get ('/ventas/:id', getOneSellById)

export default sellRouter