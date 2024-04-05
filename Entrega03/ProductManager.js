import fs from 'fs';

export default class ProductManager {
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
        return this.#products
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
    
    loadDefaultProduct() {
        this.addProduct("Papa", "una papa divino", 15, "papa.jpg", "V001", 200)
        this.addProduct("Tomate", "un tomate divino", 15, "tomate.jpg", "V002", 200)
        this.addProduct("Manzana", "una manzana deliciosa", 10, "manzana.jpg", "V003", 150)
        this.addProduct("Plátano", "un plátano maduro", 10, "platano.jpg", "V004", 100)
        this.addProduct("Naranja", "una naranja fresca", 10, "naranja.jpg", "V005", 120)
        this.addProduct("Fresa", "una fresa jugosa", 10, "fresa.jpg", "V006", 180)
        this.addProduct("Sandía", "una sandía refrescante", 5, "sandia.jpg", "V007", 300)
        this.addProduct("Piña", "una piña tropical", 5, "pina.jpg", "V008", 250)
        this.addProduct("Melón", "un melón dulce", 5, "melon.jpg", "V009", 200)
        this.addProduct("Uva", "unas uvas frescas", 10, "uva.jpg", "V010", 300)
        this.addProduct("Kiwi", "un kiwi exótico", 10, "kiwi.jpg", "V011", 200)
        this.addProduct("Mango", "un mango maduro", 5, "mango.jpg", "V012", 180)
        this.addProduct("Pera", "una pera jugosa", 10, "pera.jpg", "V013", 150)
        this.addProduct("Cereza", "unas cerezas frescas", 10, "cereza.jpg", "V014", 250)
        this.addProduct("Limón", "un limón ácido", 15, "limon.jpg", "V015", 100)
    }

}
