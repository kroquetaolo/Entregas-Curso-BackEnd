import express from 'express';
import productsRouter from './routes/api/products.route.js'
import cartsRouter from './routes/api/carts.route.js'
import viewsRouter from './routes/views.route.js'
import { __dirname } from './utils.js';

import handlebars from 'express-handlebars';
import { Server } from 'socket.io'

import {connectDB} from './config/index.js'

import MessagesManager from './dao/managers/messages.manager.js';

const app = express()
const httpServer = app.listen(8080, error => {
    if(error) console.log(error.message);
    console.log('Escuchando el puerto 8080')
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))

app.set('views', __dirname+'/views')
app.set('view engine', 'hbs')

connectDB()

app.use('/', viewsRouter)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


export const socketServer = new Server(httpServer);

const messagesManager = new MessagesManager()
socketServer.on('connection', async socket => {
    console.log('Cliente conectado')
    let messages = await messagesManager.getMessages()
    socketServer.emit('messageLogs', messages)
    socket.on('message', async data => {
        await messagesManager.updateMessages(data)
        messages = await messagesManager.getMessages()
        socketServer.emit('messageLogs', messages)
    })
})