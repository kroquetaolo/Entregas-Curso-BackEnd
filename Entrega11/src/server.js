import express from 'express';

import passport from 'passport';
import { Server } from 'socket.io'
import { __dirname } from './path.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import config, {connectDB} from './config/config.js'
import appRouters from './routes/index.js'

import { initializePassport } from './config/passport.config.js';

import MessagesManager from './dao/managers/messages.manager.js';

const app = express()

const { port, mongoUrl, cookiePassword, sessionPasword } = config

const httpServer = app.listen(port, error => {
    if(error) console.log(error.message);
    console.log('Escuchando en http://localhost:'+port)
})

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.use(cookieParser(cookiePassword))
app.use(session({
    store: MongoStore.create({mongoUrl, ttl: 60*5 }),
    secret: sessionPasword,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())

app.use(appRouters)

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