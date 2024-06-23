import CustomRouter from '../router.js';
import CartsController from '../../controllers/carts.controller.js';

export default class CartsRouter extends CustomRouter {

    init() {

        const { 
            getCarts,
            getCart,
            deleteProduct,
            deleteCart,
            addProduct,
            updateCart
        } = new CartsController()

        this.get('/', ['PUBLIC'], getCarts)
        this.get('/:cid', ['PUBLIC'], getCart)
        this.delete('/:cid/products/:pid', ['PUBLIC'], deleteProduct)
        this.delete('/:cid', ['PUBLIC'], deleteCart)
        this.put('/:cid/products/:pid', ['PUBLIC'],addProduct )
        this.post('/:cid', ['PUBLIC'], updateCart) 
    }
}