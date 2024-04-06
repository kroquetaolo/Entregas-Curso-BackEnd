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

    addProduct(title, description, price, code, stock, thumbnail = ['default_thumbnail.jpg']) {
        if (!title || !description || !price || !code || !stock) {
            console.error("All parameters are required")
            return "All parameters are required"
        }
        if (this.#products.find(product => product.code === code)){
            console.warn(`The product code for ${title} already exists`);
            return `The product code for ${title} already exists`
        }

        const newProduct = {title, description, price, thumbnail, code, stock, status: true, id: this.#getNextId()}
        this.#products.push(newProduct)
        this.setDataToFile()
        return newProduct;
    }

    limited(number){
        return this.#products.slice(0, number)
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
            return object
        } else {
            if (key === "id") {
                console.error(`key can't be "id"`)
                return `key can't be id`
            } else {
                console.warn(`ID: ${id} don't exist`)
                return `ID: ${id} don't exist`
            }
        }
    }

    deleteProduct(id) {
        if(this.getProductById(id) === "not found") {
            return `Product with ID ${id} not found`
        } else {
            this.#products = this.#products.filter(product => product.id !== id);
            this.setDataToFile(this.#path, this.#products);
            return `Product with ID ${id} deleted`
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
        this.addProduct("Papa", "una papa divino", 15, "V001", 200, ["papa-Primary.jpg", "papa-Secundary.jpg"]);
        this.addProduct("Tomate", "un tomate divino", 15, "V002", 200, ["tomate-Primary.jpg", "tomate-Secundary.jpg"]);
        this.addProduct("Manzana", "una manzana deliciosa", 10, "V003", 150, ["manzana-Primary.jpg", "manzana-Secundary.jpg"]);
        this.addProduct("Plátano", "un plátano maduro", 10, "V004", 100, ["platano-Primary.jpg", "platano-Secundary.jpg"]);
        this.addProduct("Naranja", "una naranja fresca", 10, "V005", 120, ["naranja-Primary.jpg", "naranja-Secundary.jpg"]);
        this.addProduct("Fresa", "una fresa jugosa", 10, "V006", 180, ["fresa-Primary.jpg", "fresa-Secundary.jpg"]);
        this.addProduct("Sandía", "una sandía refrescante", 5, "V007", 300, ["sandia-Primary.jpg", "sandia-Secundary.jpg"]);
        this.addProduct("Piña", "una piña tropical", 5, "V008", 250, ["pina-Primary.jpg", "pina-Secundary.jpg"]);
        this.addProduct("Melón", "un melón dulce", 5, "V009", 200, ["melon-Primary.jpg", "melon-Secundary.jpg"]);
        this.addProduct("Uva", "unas uvas frescas", 10, "V010", 300, ["uva-Primary.jpg", "uva-Secundary.jpg"]);
        this.addProduct("Kiwi", "un kiwi exótico", 10, "V011", 200);
        this.addProduct("Mango", "un mango maduro", 5, "V012", 180, ["mango-Primary.jpg", "mango-Secundary.jpg"]);
        this.addProduct("Pera", "una pera jugosa", 10, "V013", 150, ["pera-Primary.jpg", "pera-Secundary.jpg"]);
        this.addProduct("Cereza", "unas cerezas frescas", 10, "V014", 250, ["cereza-Primary.jpg", "cereza-Secundary.jpg"]);
        this.addProduct("Limón", "un limón ácido", 15, "V015", 100);
        
    }

}
