import { Router } from 'express';
import ProductManager from '../dao/managers/product.manager.js';
import CartsManager from '../dao/managers/carts.manager.js';

const router = Router();
const productManager = new ProductManager()
const cartsManager = new CartsManager()


router.get('/', async (req, res) => {
    const { filter_key, filter_value, limit, page, sort_key, sort_value } = req.query
    const products = await productManager.getProducts(filter_key, filter_value, limit, page, sort_key, sort_value)

    res.render('home', {
        products: products.docs
    })
})

router.get('/products', async (req, res) => {
    const { filter_key, filter_value, limit: query_limit, page: query_page, sort_key, sort_value } = req.query
    const { docs, limit, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await productManager.getProducts(filter_key, filter_value, query_limit, query_page, sort_key, sort_value)

    const originalUrl = req.originalUrl;
    const baseUrl = `${req.protocol}://${req.get('host')}${originalUrl.split('?')[0]}`;

    const queryParams = new URLSearchParams(req.query);
    queryParams.delete('page')

    const get_pagination = pagination(totalPages, page, `${baseUrl}?${queryParams.toString()}&page=`)

    res.render('products', {
        products: docs, limit, page, hasPrevPage, hasNextPage, totalPages,
        prevLink: hasPrevPage ? `${baseUrl}?${queryParams.toString()}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `${baseUrl}?${queryParams.toString()}&page=${nextPage}` : null,
        pagination: get_pagination
    })
})

router.get('/products/:product_id', async (req, res) => {
    const {product_id} = req.params;
    const { title, price, description, category } = await productManager.getProductById(product_id)
    res.render('products-detail', {
        title, price, description, category
    })
})


router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartsManager.getCartPopulate(cid);
    res.render('carts', {
        carts: cart.products
    })
    
})

router.get('/chat', (req, res) => {
    res.render('chat')
})

export default router

function pagination(size, index, url) {
    // let result = {has_first_page: false, has_last_page: false, first_five: false, last_last_five: false, first: false, last: false, index}
    let result = {}
    let array = Array.from({ length: size }, (_, index) => index + 1);
    if(index < 0 || index > array.length) return false
    result.url = url
    if(array.length > 8 ) {
        if (index > 8) {
            const max = array.length - 5
            if (index < max) {
                const get_first_five = Array.from({ length: 2 }, (_, x) => index - x -1)
                get_first_five.sort((a, b) => a - b)
                result.first_five = get_first_five

                const get_last_five = Array.from({ length: 2 }, (_, x) => index + x +1)
                get_last_five.sort((a, b) => a - b)
                result.last_five = get_last_five
                result.has_first_page = true
                result.has_last_page = true
                result.index = index

                result.coso = 'a'
            } else {
                const get_last_five = Array.from({ length: array.length - index }, (_, x) => index + x +1)
                get_last_five.sort((a, b) => a - b)
                result.last_five = get_last_five

                const bofore_sequence = 6 - (array.length - index)
                if(bofore_sequence !== 0) {
                    const get_first_five = Array.from({ length: bofore_sequence }, (_, x) => index - x -1)
                    get_first_five.sort((a, b) => a - b)
                    result.first_five = get_first_five
                    result.cosob = 'b2'
                }
                result.has_first_page = true
                result.index = index
                result.coso = 'b'
            }
        } else {
            const get_last_five = Array.from({ length: 8 - index }, (_, x) => index + x + 1)
            get_last_five.sort((a, b) => a - b)
            result.last_five = get_last_five
            result.coso = 'c'
            if(index !== 1) {
                const get_first_five = Array.from({ length: index - 1 }, (_, x) => index - x -1)
                get_first_five.sort((a, b) => a - b)
                result.first_five = get_first_five
                result.cosob = 'c2'
            }
            result.index = index
        }

        result.last = array.length
    } else {
        result.first_five = array 
        result.coso = 'd'
    }
    result.active = index
    return result

}