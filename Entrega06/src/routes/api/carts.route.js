import {Router} from 'express';
import { cartsModel } from '../../dao/managers/models/carts.model.js';

const router = Router()

// http://localhost:8080/api/carts/ <- ejemplo para post ;D
router.post('/', (req, res) => {
    res.status(201).send({ status: 'success', payload: cartsManager.newCart() })
    
})

// http://localhost:8080/api/carts/2 <- ejemplo para get ;D
router.get('/:cid', (req, res) => {
    const { cid } = req.params
    const result = cartsManager.getCartById(parseInt(cid))
    res.status(202).send({ status: 'success', payload: result })
})

// http://localhost:8080/api/carts/1/product/4 <- ejemplo para post
router.post('/:cid/product/:pid', (req, res) => {
    const {cid, pid} = req.params
    if(productManager.getProductById(parseInt(pid)) === "not found") {
        res.status(400).send({ status: 'failed', payload: "produc id not found" })
    } else {
        const product = productManager.getProductById(parseInt(pid))
        const result = cartsManager.addProduct(parseInt(cid), product)
        if (result instanceof Object) {
            res.status(202).send({ status: 'success', payload: result })
        } else {
            res.status(400).send({ status: 'failed', payload: result })
        }
    }
})

export default router