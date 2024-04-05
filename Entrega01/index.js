class ProductManager {
    #products
    constructor() {
        this.#products = [];
    }
    /**
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {number} price 
     * @param {string} thumbnail 
     * @param {string} code 
     * @param {number} stock 
     * @param {number} id 
     */
    
    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("All parameters are required")
        } else if (this.#products.find(product => product.code === code)){
            console.log(`The product code for ${title} already exists`);
        } else {
            const newProduct = {title, description, price, thumbnail, code, stock, id: this.#getNextId()}
            this.#products.push(newProduct)

        }

    }
    
    getProducts(){
        return this.#products
    }

    #getNextId() {
        if(this.#products.length === 0) {
            return 1
        }
        return this.#products.at(-1).id + 1
    }
    
    getProductById(id) {
        const search = this.#products.find(product => product.id === id)
        return search ? search : "not found"
    }
}

/**
 * PROCESO DE TESTING ;D
 */

const productManager = new ProductManager()
console.log("--------------------------- \n01 Productos:")
console.log(productManager.getProducts())
productManager.addProduct("Papa", "una papa hermosa", 20, "papa.jpg", "V001", 30)
console.log(productManager.getProducts())
console.log("--------------------------- \n02 Productos:")
productManager.addProduct("Tomate", "un tomate divino", 15, "tomate.jpg", "V002", 200)
productManager.addProduct("Palta", "una palta repetida", 1, "palta.jpg", "V002", 123)
console.log(productManager.getProducts())
console.log("--------------------------- \n03 Productos:")
console.log(productManager.getProductById(3))
console.log("--------------------------- \n04 Productos:")
console.log(productManager.getProductById(2))
console.log("--------------------------- \n05 Productos:")
productManager.addProduct("Lechuga", 1, "lechuga.jpg", "V004", 123)
console.log(productManager.getProducts())