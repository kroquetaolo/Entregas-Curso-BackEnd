import { logger } from '../../config/config.js';
import { cartsModel } from '../../models/carts.model.js'
export default class CartsDao {
    constructor(productsService, ticketsService) {
        this.model = cartsModel;
        this.productsService = productsService;
        this.ticketsService = ticketsService;
    }

    async getAll() {
        let result;
        try {
            result = await this.model.find({products: []})
        } catch (error) {
            result = error.message
        }
        return result
    }

    async new() {
        let result;
        try {
            result = await this.model.create({})
        } catch (error) {
            result = null
        }
        return result
    }

    async update(cart, cart_id) {
        let result;
        const exist = await this.getById(cart_id)
        if(!exist) return { message: `Cart not found for cart with id ${cart_id}`}

        try {
            const update = await this.model.updateOne({_id: cart_id}, cart)
            result = {
                message:`${cart_id} cart has been updated successfully`,
                update_result: update,
                updated_cart: cart
            }
        } catch (error) {
            log.error(error)
            result =  error.message;
        }
        return result;
    }

    async add(cart_id, product_id) {
        let result;
        const cart = await this.getById(cart_id)
        if(cart) {
            const products = cart.products
            const new_products = [...products]

            const index = new_products.findIndex(p => p.product_id._id.toString() === product_id);

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

    async getById(cart_id) {
        let result;
        try {
            result = await this.model.findOne({_id: cart_id}); 
        } catch (error) {
            result = undefined;
        }
        return result;
    }

    async getPopulate(cart_id) {
        let result;
        try {
            result = await this.model.findOne({_id: cart_id}).populate('products.product_id').lean(); 
        } catch (error) {
            result = undefined;
        }
        return result;
    }

    async delete(cart_id, type) {
        const exist = await this.getById(cart_id)
        if(!exist) 
            return { message: `Cart not found for cart with id ${cart_id}`}

        const valid_types = ['products', 'cart']
        if(!valid_types.includes(type) && type !== undefined ) 
            return { message: `the type '${type}' is an invalid type. Valid types: ${valid_types.join(", ")}`}

        let result;
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

    async remove(cart_id, product_id) {
        const exist = await this.getById(cart_id)
        if(!exist)
            return { message: `Cart not found for cart with id ${cart_id}`}

        let result;
        try {
            const cart = await this.model.findOne({_id: cart_id})
            const new_cart = [...cart.products];

            if(!new_cart.some(product => product.product_id._id.toString() === product_id)) {
                return { 
                    message: `Cart doen't have a product for the id ${product_id}`
                }
            }
            const cart_products = new_cart.filter(index => index.product_id._id.toString() !== product_id);

            result = {
                message: 'Product deleted successfully',
                delete_result: await this.model.updateOne({_id: cart_id}, {products: cart_products}),
                updated_cart: cart_products
            }
            

        } catch (error) {
            result = error.message
            logger().error(error.message);
        }
        return result
    }
    
    async purchase(purchaser, cart_id) {
        let result
        let cart
        try {
            cart = await this.getById(cart_id)
        } catch (error) {
            result = error.message
            logger().error(error.message);
        }

        const purchased = []
        const nonstock = []
        let amount = 0

        for (const value of cart.products) {
            const product = value.product_id;
            const quantity = value.quantity;

            if (product.stock > quantity) {
                // console.log('Hay suficiente stock de ' + product.title + ' se descontaran ' + quantity);
                const resultado = await this.productsService.updateProduct(product._id, 'stock', product.stock - quantity);
                if(resultado) {
                    purchased.push({product, quantity})
                    amount = amount + product.price*quantity
                }
            } else {
                nonstock.push({product, quantity})
            }
        }
        const ticket = await this.ticketsService.createTicket(purchaser, amount)
        result = {purchased, nonstock, ticket}

        return result
    }

}