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
            updateCart,
            purchaseCart
        } = new CartsController()

        this.get('/', ['ADMIN'], getCarts)
        this.get('/:cid', ['ADMIN'], getCart)
        this.delete('/:cid/products/:pid', ['USER', 'ADMIN'], deleteProduct)
        this.delete('/:cid', ['USER', 'ADMIN'], deleteCart)
        this.put('/:cid/products/:pid', ['USER', 'ADMIN'], addProduct)
        this.post('/:cid', ['USER', 'ADMIN'], updateCart) 

        this.post('/:cid/purchase', ['PUBLIC'], purchaseCart)

    }
}