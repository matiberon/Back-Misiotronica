import express from 'express'
import autenticacionDeToken from '../middlewares/tokenAuthentication.js'

const cartRouter = express.Router()

import { getAllCarts, getOneCartById, saveCart } from '../controllers/cartController.js'

cartRouter.get ('/carritos', autenticacionDeToken, getAllCarts)
cartRouter.get ('/carritos/:id', getOneCartById)
cartRouter.post ('/carrito', saveCart)

export default cartRouter