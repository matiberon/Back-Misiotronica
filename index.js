import express from 'express'

import db from './db/connection.js'

import makeBody from './middlewares/makeBody.js'
import authentication from './middlewares/authentication.js'

import userRouter from './routes/userRouter.js'
import adminRouter from './routes/adminRouter.js'
import providerRouter from './routes/providerRouter.js'
import clientRouter from './routes/clientRouter.js'
import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRouter.js'
import sellRouter from './routes/sellRouter.js'

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul> <li>GET: /usuarios/</li> <li>GET: /administradores/</li> <li>GET: /proveedores/</li> <li>GET: /clientes/</li> <li>GET: /productos/</li> <li>GET: /carritos/</li> <li>GET: /ventas/</li> <li>GET: /usuarios/id</li> <li>GET: /administradores/id</li> <li>GET: /proveedores/id</li> <li>GET: /clientes/id</li> <li>GET: /carritos/id</li> <li>GET: /ventas/id</li> <li>POST: /usuarios/administrador/</li> <li>POST: /usuarios/proveedor/</li> <li>POST: /usuarios/cliente/</li> <li>POST: /productos/</li> <li>POST: /carrito/</li> <li>PATCH: /usuarios/id</li> <li>PATCH: /aumentarStock</li> <li>DELETE: /usuarios/id</li></ul>' 

const app = express()

const expossedPort = 1234

app.get('/', (req, res) => {
	res.status(200).send(html)
})

app.use(makeBody)

//Enrutamiento
app.use('/', userRouter)
app.use('/', adminRouter)
app.use('/', providerRouter)
app.use('/', clientRouter)
app.use('/', productRouter)
app.use('/', cartRouter)
app.use('/', sellRouter)

// Endpoint para la validacion de datos de loggeo.
app.post('/auth', authentication) 

app.get('/', (req, res) => {
	res.status(200).send(html)
})

app.use((req, res) => {
	res.status(404).send('404')
})

try {
	await db.authenticate()
	console.log ('Conexion con la DDBB establecida.')
} catch (error) {
	console.log ('Error de conexion DDBB.')
}

app.listen(expossedPort, () => {
	console.log('Servidor escuchando en http://localhost:' + expossedPort)
})