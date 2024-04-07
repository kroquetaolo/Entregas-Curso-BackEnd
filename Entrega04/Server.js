import express from 'express';
import productsRouter from './src/routes/products.route.js'
import cartsRouter from './src/routes/carts.route.js'
import { __dirname } from './src/Utils/Statics.js';

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


app.get('/', (req, res) => {
    res.send(`Intenta con esta ruta "api/products" ;D`)
})

app.listen(8080, error => {
    if(error) console.log(error.message);
    console.log('Escuchando el puerto 8080')
})