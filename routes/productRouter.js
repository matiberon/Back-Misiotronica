import express from 'express'
import autenticacionDeToken from '../middlewares/tokenAuthentication.js'

const productRouter = express.Router()

import { getAllProducts, getOneProductById, saveProduct, editProductStock } from '../controllers/productController.js'

productRouter.get ('/productos', getAllProducts)
productRouter.get ('/productos/:id', getOneProductById)
productRouter.post ('/productos', autenticacionDeToken, saveProduct)
productRouter.patch ('/aumentarStock', autenticacionDeToken, editProductStock)

export default productRouter