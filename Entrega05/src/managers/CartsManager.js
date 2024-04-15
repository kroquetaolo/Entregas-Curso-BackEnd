import fs from 'fs';

export default class CartsManager {
    #carts
    #path
    constructor(path) {
        this.#carts = [];
        this.#path = path;
        if(fs.existsSync(this.#path)) this.#carts = this.getDataFromFile()
    }

    newCart() {
        const cart = {products: [], id: this.#getNextId()}
        this.#carts.push(cart)
        this.setDataToFile()
        return cart
    }

    addProduct(cartId, clientProduct) {
        const cartItem = this.getCartById(cartId)
        if(cartItem === undefined) {
            return `The cart with id ${cartId} don't exists`
        } else {
            const products = cartItem.products
            const index = products.findIndex(p => p.product === clientProduct.id);
            if (index !== -1) {
                products[index].quantity++;
            } else {
                products.push({ product: clientProduct.id, quantity: 1 });
            }
            this.setDataToFile()
            return products;
        }
    }

    getCartById(id) {
        return this.#carts.find(cart => cart.id === id)
    }

    getDataFromFile() {
        const data = fs.readFileSync(this.#path, "utf8");
        return JSON.parse(data)
    }

    #getNextId() {
        if(this.#carts.length === 0) {
            return 1
        }
        return this.#carts.at(-1).id + 1
    }
    setDataToFile() {
        fs.writeFileSync(this.#path, JSON.stringify(this.#carts, null, "\t"), "utf8");
    }
}