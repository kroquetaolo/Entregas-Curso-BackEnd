import { Router } from 'express';
import { productManager } from './products.route.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('home', {
        products: productManager.getProducts()
    })
})

router.get('/realtimeproducts', (req, res) => {
    productManager.socketDataLoad()
    res.render('realTimeProducts')
})

export default router