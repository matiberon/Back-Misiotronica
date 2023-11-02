import express from 'express'
import autenticacionDeToken from '../middlewares/tokenAuthentication.js'

const userRouter = express.Router()

import { getAllUsers, getOneUserById, editUser, deleteUser  } from '../controllers/userController.js'

userRouter.get ('/usuarios', autenticacionDeToken, getAllUsers)
userRouter.get ('/usuarios/:id', autenticacionDeToken, getOneUserById)
userRouter.patch ('/usuarios/:id', autenticacionDeToken, editUser)
userRouter.delete ('/usuarios/:id', autenticacionDeToken, deleteUser)

export default userRouter