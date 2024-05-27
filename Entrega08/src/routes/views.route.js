import { Router } from 'express';
import ProductManager from '../dao/managers/product.manager.js';
import CartsManager from '../dao/managers/carts.manager.js';
import UsersManager from '../dao/managers/users.manager.js';
import { pagination } from '../pagination.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();
const productManager = new ProductManager()
const cartsManager = new CartsManager()
const usersManager = new UsersManager()


router.get('/', async (req, res) => {
    // const { filter_key, filter_value, limit, page, sort_key, sort_value } = req.query
    // const products = await productManager.getProducts(filter_key, filter_value, limit, page, sort_key, sort_value)

    // res.render('home', {
    //     products: products.docs
    // })

    if(!req.session.user) res.redirect('/login')
    else res.redirect('/products')
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

router.get('/register', (req, res) => {
    if(req.session.user) {
        res.redirect('/')
    } else {
        res.render('register')
    }
})

router.get('/login', (req, res) => {
    if(req.session.user) {
        res.redirect('/')
    } else {
        res.render('login')
    }
})

router.get('/users', auth, async (req, res) => {
    const users = await usersManager.getUsers()
    res.render('users', {
        users
    })
})

export default router