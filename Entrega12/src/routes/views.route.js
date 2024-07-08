import { pagination } from '../utils/pagination.js';
import CustomRouter from './router.js';

import { productsService, cartsService, usersService } from '../service/index.js'

export default class viewsRouter extends CustomRouter {
    init() {
        
        this.get('/', ['PUBLIC'], async (req, res) => {
            if(!req.user) res.redirect('/login')
            else res.redirect('/products')
        })
        
        this.get('/products', ['PUBLIC'], async (req, res) => {
            const { filter_key, filter_value, limit: query_limit, page: query_page, sort_key, sort_value } = req.query
            const request_object = {filter_key, filter_value, query_limit, query_page, sort_key, sort_value}
            
            const { docs, limit, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await productsService.getProducts(request_object)
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
        
        this.get('/products/:product_id', ['USER', 'ADMIN'], async (req, res) => {
            const {product_id} = req.params;
            const { title, price, description, category, _id } = await productsService.getProductById(product_id)
            res.render('products-detail', {
                title, price, description, category, _id
            })
        })
        
        this.get('/carts/:cid', ['USER', 'ADMIN'], async (req, res) => {
            const { cid } = req.params;
            const cart = await cartsService.getCartPopulate(cid);
            cart.products.forEach(product => product.cart_id = cid)
            res.render('carts', {
                carts: cart.products,
                cart_id: cid
            })
            
        })
        
        this.get('/chat', ['USER', 'ADMIN'], (req, res) => {
            res.render('chat')
        })
        
        this.get('/register', ['PUBLIC'], (req, res) => {
            if(req.user) {
                res.redirect('/')
            } else {
                res.render('register')
            }
        })
        
        this.get('/login', ['PUBLIC'], (req, res) => {
            if(req.user) {
                res.redirect('/')
            } else {
                res.render('login')
            }
        })
        
        this.get('/users', ['ADMIN'], async (req, res) => {
            const users = await usersService.getUsers()
            res.render('users', {
                users
            })
        })
        
        this.get('*', ['PUBLIC'], async (req, res) => {
            res.render('notfound')
        })
    }
}