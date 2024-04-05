const fs = require('fs')

class ProductManager {
    #products
    #path
    constructor(path) {
        this.#products = [];
        this.#path = path;
        if(fs.existsSync(this.#path)) this.#products = this.getDataFromFile()
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
            return console.error("All parameters are required")
        }
        if (this.#products.find(product => product.code === code)){
            return console.warn(`The product code for ${title} already exists`);
        }

        const newProduct = {title, description, price, thumbnail, code, stock, id: this.#getNextId()}
        this.#products.push(newProduct)
        this.setDataToFile()
        console.log(`${newProduct.title} added`)
    }

    #getNextId() {
        if(this.#products.length === 0) {
            return 1
        }
        return this.#products.at(-1).id + 1
    }

    getProducts(){
        console.log(this.#products)
    }

    getProductById(id) {
        const search = this.#products.find(product => product.id === id)
        return search ? search : "not found"
    }

    updateProduct(id, key, newValue) {
        const object = this.#products.find(product => product.id === id)
        if(object && key != "id") {
            object[key] = newValue
            this.setDataToFile();
            console.log(`${object.title} updated`)
        } else {
            key === "id" ? console.error(`key can't be "id"`) : console.warn(`${id} don't exist`);
        }
    } 

    deleteProduct(id) {
        if(this.getProductById(id) === "not found") {
            console.error(`Product with ID ${id} not found`);
        } else {
            this.#products = this.#products.filter(product => product.id !== id);
            this.setDataToFile(this.#path, this.#products);
            console.log(`Product with ID ${id} deleted`);
        }
    }

    getDataFromFile() {
        const data = fs.readFileSync(this.#path, "utf8");
        return JSON.parse(data)
    }
    
    setDataToFile() {
        fs.writeFileSync(this.#path, JSON.stringify(this.#products, null, "\t"), "utf8");
    }
    
}

/**
 * PROCESO DE TESTING ;D
 */

console.log("---------------------------\n01 Productos:\n---------------------------")
const productManager = new ProductManager('./products.json')
productManager.getProducts()
productManager.addProduct("Papa", "una papa divino", 15, "papa.jpg", "V001", 200)
console.log("--------------------------- \n02 Productos:")
productManager.addProduct("Tomate", "un tomate divino", 15, "tomate.jpg", "V002", 200)
productManager.addProduct("Palta", "una palta repetida", 1, "palta.jpg", "V002", 123) 
console.log("--------------------------- \n03 Productos:")
console.log(productManager.getProductById(3)) 
console.log("--------------------------- \n04 Productos:")
console.log(productManager.getProductById(2))
console.log("--------------------------- \n05 Productos:")
productManager.addProduct("Lechuga", 1, "lechuga.jpg", "V004", 123)

productManager.getProducts()

setTimeout(function() {
    productManager.updateProduct(1, "juejuejue" , "me equivoque parece")
    setTimeout(() => {
        productManager.updateProduct(1, "juejuejue")
        productManager.updateProduct(1, "price", 12)
        productManager.updateProduct(1, "id", 3)
        setTimeout(() => {
            productManager.deleteProduct(2)
            productManager.deleteProduct(3)
        }, 5000);
    }, 5000);
}, 5000)