import express from 'express';
import ProductManager from './ProductManager.js';

const app = express()
const productManager = new ProductManager('./products.json')

app.get('/', (req, res) => {
    res.send(`Intenta con esta ruta "/products" ;D`)
})

app.get('/products', (req, res) => {
    const { limit } = req.query
    if(!limit) return res.send(productManager.getProducts())
    const numberLimit = Number.parseInt(limit)
    res.json(productManager.getProducts().slice(0, numberLimit))
})

app.get('/products/:pid', (req, res) => {
    const { pid } = req.params
    const numberID = Number.parseInt(pid)
    res.json(productManager.getProductById(numberID))
})

app.listen(8080, error => {
    console.log('Escuchando el puerto 8080')
})