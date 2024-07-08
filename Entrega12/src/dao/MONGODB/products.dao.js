import { productsModel } from '../../models/products.model.js';

export default class ProductsDao {
    constructor() {
        this.model = productsModel;
    }

    async getAll(values){
        const { filter_key, filter_value, query_limit: req_limit, query_page: req_page, sort_key, sort_value } = values
        const  filter = filter_key && filter_value ? {[filter_key]: filter_value} : {}
        const options = {
            lean: true,
            limit: req_limit || 10,
            page: req_page || 1,
            sort: sort_key && !isNaN(sort_value) ? {[sort_key]: parseInt(sort_value)} : {}
        }

        const result = await this.model.paginate(filter, options);
        return result
    }

    async getById(pid) {
        try {
            const result = await this.model.findOne({ _id: pid })
            return result
        } catch (error) {
            return "not found"
        }
    }

    async add(product) {
        const exist = await this.model.findOne({code: product.code})
        if(exist) {
            return `The product code for ${product.title} already exists`
        } else {
            const newProduct = await this.model.create(product)
            return newProduct;
        }
    }

    async update(pid, key, newValue) {
        const valid_values = ["title", "description", "price", "code", "stock", "thumbnail", "status"]
        if(!valid_values.includes(key)) {
            return `the key '${key}' is an invalid value. Valid values: ${valid_values.join(", ")}`
        }

        try {
            const result = await this.model.updateOne({_id: pid}, {[key]: newValue})
            return result
        } catch (error) {
            return error.message
        }
    }

    async delete(pid) {
        try {
            const result = await this.model.deleteOne({_id: pid})
            return result
        } catch (error) {
            return error.message
        }
    }

}