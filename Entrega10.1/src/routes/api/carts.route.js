import CartsManager from '../../dao/managers/carts.manager.js';
import CustomRouter from '../router.js';

export default class CartsRouter extends CustomRouter {

    init() {
        
        const cartService = new CartsManager()

        this.get('/', ['PUBLIC'], async (req, res) => {
            const result = await cartService.getCarts();
            res.sendSuccess(result)
        })
        
        this.get('/:cid', ['PUBLIC'], async (req, res) => {
            const { cid } = req.params
            const result = await cartService.getCartById(cid)
            res.sendSuccess(result)
        })
        
        this.delete('/:cid/products/:pid', ['PUBLIC'], async (req, res) => {
            const {cid, pid} = req.params
            const result = await manager.deleteProduct(cid, pid)
            res.sendSuccess(result)
        }) 
        
        this.delete('/:cid', ['PUBLIC'], async (req, res) => {
            const {cid} = req.params
            const { type } = req.query
            
            const result = await manager.deleteCart(cid, type)
            res.sendSuccess(result)
        }) 
        
        this.put('/:cid/products/:pid', ['PUBLIC'], async (req, res) => {
            const { cid, pid } = req.params
        
            const result = await manager.addProduct(cid, pid)
            res.sendSuccess(result)
        })
        
        this.post('/:cid', ['PUBLIC'], async (req, res) => {
            const { cid } = req.params
            const result = await manager.updateCart(req.body, cid)
            res.sendSuccess(result)
        }) 
    }
}