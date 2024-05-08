import { Router } from 'express'
import ProductDBManager from '../../dao/managers/productDB.manager.js';

const router = Router()
const productManager = new ProductDBManager()

router.get('/', async (req, res) => {
    const { limit } = req.query

    if(!limit) {
        const products = await productManager.getProducts()
        return res.send(products)
    }
    const result  = await productManager.limited(limit)
    res.status(200).send(result);

})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const product = await productManager.getProductById(pid)
    res.status(200).send({ status: 'success', payload: product })
})

router.post('/', async (req, res) => {
    const {title, description, price, code, stock, thumbnail} = req.body

    if (!title || !description || !price || !code || !stock) {
        res.status(200).send("All parameters are required")
    } else {
        const product = {
            title,
            description,
            price,
            code,
            stock,
            thumbnail: thumbnail ?? ['default_thumbnail.jpg'],
            status: true
        }
        const newProduct = await productManager.addProduct(product)
        res.status(200).send(newProduct)
    }

})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const {key, newValue} = req.body
    const result = await productManager.updateProduct(pid, key, newValue)
    res.status(200).send(result)

})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    const result = await productManager.deleteProduct(pid)
    res.status(200).send(result)
})

export default router