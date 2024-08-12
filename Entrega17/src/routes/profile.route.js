import CustomRouter from './router.js';
import { productsService } from '../service/index.js'

export default class ProfilesRouter extends CustomRouter {
    init() {

        this.get('/', ['PREMIUM', 'ADMIN'], async (req, res) => {
            res.render('profile/user-home')
        })

        this.get('/newproduct', ['PREMIUM', 'ADMIN'], async (req, res) => {
            res.render('profile/new-product')
        })

        this.get('/products', ['PREMIUM', 'ADMIN'], async (req, res) => {
            const owner = req.user.email
            const products = await productsService.getProductBy({ owner })
            res.render('profile/user-products', { products })
        })

    }
}