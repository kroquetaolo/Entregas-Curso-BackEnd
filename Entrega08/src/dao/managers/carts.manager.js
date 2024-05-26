import { cartsModel } from '../../dao/managers/models/carts.model.js'

export default class CartsManager {
    constructor() {
        this.model = cartsModel;
    }

    async getCarts() {
        let result;
        try {
            result = await this.model.find({})
        } catch (error) {
            result = error.message
        }
        return result
    }

    async updateCart(cart, cart_id) {
        let result;
        const exist = await this.getCartById(cart_id)
        if(!exist) return { message: `Cart not found for cart with id ${cart_id}`}

        try {
            result = {
                message:`${cart_id} cart has been updated successfully`,
                update_result: await this.model.updateOne({_id: cart_id}, cart),
                updated_cart: cart
            }
        } catch (error) {
            result =  error.message;
        }
        return result;
    }

    async addProduct(cart_id, product_id) {
        let result;
        const cart = await this.getCartById(cart_id)
        if(cart) {
            const products = cart.products
            const new_products = [...products];

            const index = new_products.findIndex(p => p.product_id === product_id);
            index !== -1 ? new_products[index].quantity++ : new_products.push({ product_id: product_id, quantity: 1 })

            try {
                result = {
                    update_result: await this.model.updateOne({_id: cart_id},{products: new_products}),
                    updated_cart: {products: new_products}
                }
            } catch (error) {
                result = error.message;
            }
        } else {
            try {
                result = {
                    message: 'a new cart has been created',
                    result: await this.model.create({products: [{product_id, quantity: 1}]})
                }
            } catch (error) {
                result = error.message;
            }
        }

        return result;
        
    }

    async getCartById(cart_id) {
        let result;
        try {
            result = await this.model.findOne({_id: cart_id}); 
        } catch (error) {
            result = undefined;
        }
        return result;
    }

    async getCartPopulate(cart_id) {
        let result;
        try {
            result = await this.model.findOne({_id: cart_id}).populate('products.product_id').lean(); 
        } catch (error) {
            result = undefined;
        }
        return result;
    }

    async deleteCart(cart_id, type) {
        const exist = await this.getCartById(cart_id)
        if(!exist) 
            return { message: `Cart not found for cart with id ${cart_id}`}

        const valid_types = ['products', 'cart']
        if(!valid_types.includes(type) && type !== undefined ) 
            return { message: `the type '${type}' is an invalid type. Valid types: ${valid_types.join(", ")}`}

        let result;
        // la consigna decía 'deberá eliminar todos los productos del carrito' y no entendí
        // si debían ser solo los productos o el cart
        // así que puse las dos ;D
        try {
            if(type === 'cart') {
                result = {
                    message: `The cart ${cart_id} has been deleted`,
                    delete_result: await this.model.deleteOne({_id: cart_id})
                }
            } else {
                result = {
                    message: `All products in the cart ${cart_id} has been removed`,
                    delete_result: await this.model.updateOne({_id: cart_id}, {products: []})
                }
            }
        } catch (error) {
            result = error.message;
        }
        return result
    }

    async deleteProduct(cart_id, product_id) {
        const exist = await this.getCartById(cart_id)
        if(!exist) 
            return { message: `Cart not found for cart with id ${cart_id}`}

        let result;
        try {
            const cart = await this.model.findOne({_id: cart_id})
            const new_cart = [...cart.products];
            if(!new_cart.some(product => product.product_id === product_id)) return { message: `Cart doen't have a product for the id ${product_id}`}
            const cart_products = new_cart.filter(index => index.product_id !== product_id);

            result = {
                message: 'Product deleted successfully',
                delete_result: await this.model.updateOne({_id: cart_id}, {products: cart_products}),
                updated_cart: cart_products
            }
            

        } catch (error) {
            result = error.message
            console.log(error.message);
        }
        return result
    }
    

}