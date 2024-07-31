import { logger } from '../../config/config.js';
import { productsModel } from '../../models/products.model.js';
import { CustomError } from '../../service/errors/custom.error.js';
import { EError } from '../../service/errors/enums.js';

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

    async getBy(filter) {
        try {
            const result = await this.model.find(filter).lean()
            return result
        } catch (error) {
            return "not found"
        }
    }

    async add(product) {
        let result
        try {
            result = await this.model.create(product)
        } catch (error) {
            console.log(error);
            logger().error(error.message)
        }
        return result;
        
    }

    async update(pid, key, newValue) {
        const valid_values = ["title", "description", "price", "stock", "thumbnail", "status"]
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

    async delete(pid, user) {
        let result
        try {
            const product = await this.getById(pid)
            if (product.owner !== user.email && !(user.rol.toUpperCase() !== 'ADMIN' || user.rol.toUpperCase() !== 'PREMIUM')) {
                result = {error: 'you can only delete your own products'}
            } else {
                try {
                    result = await this.model.deleteOne({_id: pid})
                } catch (error) {
                    result = error.message
                }
            }
        } catch (error) {
            result = error.message
        }

        return result
    }

}