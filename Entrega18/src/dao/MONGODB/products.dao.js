import { logger } from '../../config/config.js';
import ProductDTO from '../../dto/product.dto.js';
import { productsModel } from '../../models/products.model.js';
import { pagination } from '../../utils/pagination.js'

import { CustomError } from "../../service/errors/custom.error.js"
import { EError } from "../../service/errors/enums.js"
import { generateProductsError } from "../../service/errors/info.js"

export default class ProductsDao {
    constructor() {
        this.model = productsModel;
    }

    async getAll(req){
        const { 
            filter_key, 
            filter_value, 
            limit = 12, 
            page = 1, 
            sort_key, 
            sort_value 
        } = req.query;

        const  filter = filter_key && filter_value ? {[filter_key]: filter_value} : {}

        const originalUrl = req.originalUrl;
        const baseUrl = `${req.protocol}://${req.get('host')}${originalUrl.split('?')[0]}`;
        const queryParams = new URLSearchParams(req.query);
        queryParams.delete('page')

        const options = {
            lean: true,
            limit,
            page,
            sort: sort_key && !isNaN(sort_value) ? { [sort_key]: parseInt(sort_value) } : {}
        };

        const data = await this.model.paginate(filter, options);

        const result = {
            ...data,
            prevLink: data.hasPrevPage ? `${baseUrl}?${queryParams.toString()}&page=${data.prevPage}` : null,
            nextLink: data.hasNextPage ? `${baseUrl}?${queryParams.toString()}&page=${data.nextPage}` : null,
            pagination: pagination(data.totalPages, parseInt(page), `${baseUrl}?${queryParams.toString()}&page=`)
        }

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

    async add(filter, owner) {
        let result
        const { title, description, price, stock, thumbnail } = filter
        if (!title || !description || !price || !stock) {
            CustomError.createError({
                name: 'Missing parameters',
                cause:  generateProductsError( {title, description, price, stock}),
                message: 'Error adding the product',
                code: EError.INVALID_TYPE_ERROR
            })
        } else {
            try {
                const product = { title, description, price, stock, thumbnail, owner }
                result = await this.model.create(new ProductDTO(product))
            } catch (error) {
                console.log(error);
                logger().error(error.message)
            }
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
            if(product === 'not found') return {message: 'Product not found'}
            if (product.owner !== user.email && !(user.rol.toUpperCase() !== 'ADMIN' || user.rol.toUpperCase() !== 'PREMIUM')) {
                result = {error: 'you can only delete your own products'}
            } else {
                try {
                    result = await this.model.deleteOne({_id: pid})
                } catch (error) {
                    result = error.message
                    console.log('delete', error)
                }
            }
        } catch (error) {
            result = error.message
        }

        return result
    }

}