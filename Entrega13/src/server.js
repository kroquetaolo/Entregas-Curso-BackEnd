import express from 'express';

import cors from 'cors'
import passport from 'passport';
import { Server } from 'socket.io'
import { __dirname } from './path.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import config from './config/config.js'
import appRouters from './routes/index.js'

import { initializePassport } from './config/passport.config.js';
import { connectChatSocket } from './utils/chat.js';
import { helpers } from './utils/helpers.js';

const app = express()
app.use(cors())

const { port, mongoUrl, cookiePassword, sessionPasword } = config

const httpServer = app.listen(port, error => {
    if(error) console.log(error.message);
    console.log('Escuchando en http://localhost:'+port)
})

export const socketServer = new Server(httpServer);

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
connectChatSocket()

app.use(passport.initialize())

app.use(appRouters)

app.engine('hbs', handlebars.engine({ extname: '.hbs', helpers }))

app.set('views', __dirname+'/views')
app.set('view engine', 'hbs')