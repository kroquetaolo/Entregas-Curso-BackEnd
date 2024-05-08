import { socketServer } from '../../server.js';
import { productsModel } from './models/products.model.js';

export default class ProductDBManager {

    async getProducts(){
        const result  = await productsModel.find({})
        return result
    }

    async limited(limit){
        const result  = await productsModel.find({}).limit(Number.parseInt(limit))
        return result
    }

    async getProductById(pid) {
        try {
            const result = await productsModel.findOne({ _id: pid })
            return result
        } catch (error) {
            return "not found"
        }
    }

    /**
     * @param {string} title 
     * @param {string} description 
     * @param {number} price 
     * @param {string} thumbnail 
     * @param {string} code 
     * @param {number} stock
     */

    async addProduct(product) {
        const exist = await productsModel.findOne({code: product.code})
        if(exist) {
            return `The product code for ${product.title} already exists`
        } else {
            const newProduct = await productsModel.create(product)
            this.socketDataChanged()
            return newProduct;

        }
    }

    async updateProduct(pid, key, newValue) {
        const validValues = ["title", "description", "price", "code", "stock", "thumbnail"]
        if(!validValues.includes(key)) {
            return `the key '${key}' is an invalid value. Valid values: ${validValues.join(", ")}`
        }

        try {
            const result = await productsModel.updateOne({_id: pid}, {[key]: newValue})
            this.socketDataChanged()
            return result
        } catch (error) {
            return error.message
        }
    }

    async deleteProduct(pid) {
        try {
            const result = await productsModel.deleteOne({_id: pid})
            this.socketDataChanged()
            return result
        } catch (error) {
            return error.message
        }
    }

    async socketDataLoad() {
        socketServer.on('connection', socket => {
            console.log("cliente conectado")
            this.getProducts().then(products =>{
                socket.emit('dataLoad', products)
            })
        })
    }

    async socketDataChanged() {
        this.getProducts().then(products => {
            socketServer.emit('dataChanged', products)
        })
    }

    async loadDefaultProduct() {
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