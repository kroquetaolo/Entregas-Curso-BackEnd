import express from 'express';
import productsRouter from './routes/products.route.js'
import cartsRouter from './routes/carts.route.js'
import viewsRouter from './routes/views.route.js'
import { __dirname } from './utils.js';

import handlebars from 'express-handlebars';
import { Server } from 'socket.io'

const app = express()
const httpServer = app.listen(8080, error => {
    if(error) console.log(error.message);
    console.log('Escuchando el puerto 8080')
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


export const socketServer = new Server(httpServer);