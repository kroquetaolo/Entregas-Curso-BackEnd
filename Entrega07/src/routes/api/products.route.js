import { Router } from 'express'
import ProductManager from '../../dao/managers/product.manager.js';

const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res) => {
    const { filter_key, filter_value, limit, page, sort_key, sort_value } = req.query

    const data = await productManager.getProducts(filter_key, filter_value, limit, page, sort_key, sort_value)

    const originalUrl = req.originalUrl;
    const baseUrl = `${req.protocol}://${req.get('host')}${originalUrl.split('?')[0]}`;
    const queryParams = new URLSearchParams(req.query);
    queryParams.delete('page')

    const result = {
        status: 'success',
        payload: data.docs,
        totalPages: data.totalPages,
        page: data.page,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `${baseUrl}?${queryParams.toString()}&page=${data.prevPage}` : null,
        nextLink: data.hasNextPage ? `${baseUrl}?${queryParams.toString()}&page=${data.nextPage}` : null
    }
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