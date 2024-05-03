import { Router } from 'express';
import ProductManager from '../dao/managers/productDB.manager.js';

const router = Router();
const productManager = new ProductManager()

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    const jsonProduct = JSON.stringify(products)
    res.render('home', {
        products: JSON.parse(jsonProduct)
    })
})

router.get('/realtimeproducts', async (req, res) => {
    await productManager.socketDataLoad()
    res.render('realTimeProducts')
})

router.get('/chat', (req, res) => {
    res.render('chat')
})

export default router