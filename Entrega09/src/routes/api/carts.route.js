import {Router} from 'express';
import CartsManager from '../../dao/managers/carts.manager.js';

const router = Router()
const manager = new CartsManager()

router.get('/', async (req, res) => {
    const result = await manager.getCarts();
    res.status(200).send({ status: 'success', payload: result})
    
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const result = await manager.getCartById(cid)
    res.status(202).send({ status: 'success', payload: result })
})

router.delete('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const result = await manager.deleteProduct(cid, pid)
    res.status(202).send({ status: 'success', payload: result })
}) 

router.delete('/:cid', async (req, res) => {
    const {cid} = req.params
    const { type } = req.query
    
    const result = await manager.deleteCart(cid, type)
    res.status(202).send({ status: 'success', payload: result })
}) 

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params

    const result = await manager.addProduct(cid, pid)
    res.status(202).send({ status: 'success', payload: result })
})

router.post('/:cid', async (req, res) => {
    const { cid } = req.params
    const result = await manager.updateCart(req.body, cid)
    res.status(202).send({ status: 'success', payload: result })
}) 

export default router