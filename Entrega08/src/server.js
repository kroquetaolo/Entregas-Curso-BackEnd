import express from 'express';
import productsRouter from './routes/api/products.route.js'
import cartsRouter from './routes/api/carts.route.js'
import sessionsRouter from './routes/api/sessions.route.js'
import viewsRouter from './routes/views.route.js'

import { __dirname } from './utils.js';
import MessagesManager from './dao/managers/messages.manager.js';

import handlebars from 'express-handlebars';
import { Server } from 'socket.io'

import {connectDB} from './config/index.js'

import cookieParser from 'cookie-parser';
import session from 'express-session';

import MongoStore from 'connect-mongo';



const app = express()
const httpServer = app.listen(8080, error => {
    if(error) console.log(error.message);
    console.log('Escuchando el puerto 8080')
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.use(cookieParser('p4ssw0rd'))
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://user:iFNVqxDMwG9Gs4Si@ecommerce.lrmmnhj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce',
        ttl: 60*5
    }),
    secret: 'p4ssw0rd',
    resave: true,
    saveUninitialized: true
}))

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        equals: function(first, second) {
            return first === second;
        },
        getAge: function(birthdate) {
            const birthDate = new Date(birthdate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
    }
}))

app.set('views', __dirname+'/views')
app.set('view engine', 'hbs')

connectDB()

app.use((req, res, next) => {
    if(req.session) res.locals.session = req.session;
    next();
});

app.use('/', viewsRouter)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)

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