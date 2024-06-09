import ProductManager from '../dao/managers/product.manager.js';
import CartsManager from '../dao/managers/carts.manager.js';
import UsersManager from '../dao/managers/users.manager.js';
import { pagination } from '../utils/pagination.js';
import CustomRouter from './router.js';

export default class viewsRouter extends CustomRouter {
    init() {
        const productManager = new ProductManager()
        const cartsManager = new CartsManager()
        const usersManager = new UsersManager()
        
        this.get('/', ['PUBLIC'], async (req, res) => {
            if(!req.user) res.redirect('/login')
            else res.redirect('/products')
        })
        
        this.get('/products', ['PUBLIC'], async (req, res) => {
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
        
        this.get('/products/:product_id', ['PUBLIC'], async (req, res) => {
            const {product_id} = req.params;
            const { title, price, description, category } = await productManager.getProductById(product_id)
            res.render('products-detail', {
                title, price, description, category
            })
        })
        
        
        this.get('/carts/:cid', ['PUBLIC'], async (req, res) => {
            const { cid } = req.params;
            const cart = await cartsManager.getCartPopulate(cid);
            res.render('carts', {
                carts: cart.products
            })
            
        })
        
        this.get('/chat', ['PUBLIC'], (req, res) => {
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
            const users = await usersManager.getUsers()
            console.log(users);
            res.render('users', {
                users
            })
        })
        
        this.get('*', ['PUBLIC'], async (req, res) => {
            res.render('notfound')
        })
    }
}