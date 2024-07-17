import { cartsService, usersService } from "../service/index.js";

class CartsController {
    #cartService
    constructor() {
        this.#cartService = cartsService
    }

    getCarts = async (req, res) => {
        const result = await this.#cartService.getCarts();
        res.sendSuccess(result)
    }

    getCart = async (req, res) => {
        const { cid } = req.params
        const result = await this.#cartService.getCartById(cid)
        res.sendSuccess(result)
    }

    deleteProduct = async (req, res) => {
        const {cid, pid} = req.params
        const result = await this.#cartService.deleteProduct(cid, pid)
        res.sendSuccess(result)
    }

    deleteCart = async (req, res) => {
        const {cid} = req.params
        const { type } = req.query
        
        const result = await this.#cartService.deleteCart(cid, type)
        res.sendSuccess(result)
    }
    addProduct = async (req, res) => {
        const { cid, pid } = req.params
    
        const result = await this.#cartService.addProduct(cid, pid)
        res.sendSuccess(result)
    }
    updateCart = async (req, res) => {
        const { cid } = req.params
        const result = await this.#cartService.updateCart(req.body, cid)
        res.sendSuccess(result)
    }

    purchaseCart = async (req, res) => {
        const { cid } = req.params
        const result = await this.#cartService.purchaseCart(req.user.email, cid)

        if(result.nonstock.length === 0) {
            await cartsService.deleteCart(cid, 'products')
        } else {
            const new_cart = []

            for(const values of result.nonstock) {
                const product = {
                    product_id: values.product._id,
                    quantity: values.quantity
                }
                
                new_cart.push(product)
            }
                
            const updateObject = { products: new_cart };
            await cartsService.updateCart(updateObject, cid)
        }

        res.sendSuccess(result)

    }
}

export default CartsController