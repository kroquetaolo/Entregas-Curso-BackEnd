import { CustomError } from "../service/errors/custom.error.js"
import { EError } from "../service/errors/enums.js"
import { generateProductsError } from "../service/errors/info.js"
import { productsService } from "../service/index.js"

class ProductsController {
    #productService
    constructor() {
        this.#productService = productsService
    }

    getProducts = async (req, res) => {
    
        const data = await this.#productService.getProducts(req.query)
    
        const originalUrl = req.originalUrl;
        const baseUrl = `${req.protocol}://${req.get('host')}${originalUrl.split('?')[0]}`;
        const queryParams = new URLSearchParams(req.query);
        queryParams.delete('page')
    
        const result = {
            status: 'success',
            payload: data.docs,
            totalPages: data.totalPages,
            page: data.page,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.hasPrevPage ? `${baseUrl}?${queryParams.toString()}&page=${data.prevPage}` : null,
            nextLink: data.hasNextPage ? `${baseUrl}?${queryParams.toString()}&page=${data.nextPage}` : null
        }
        res.sendSuccess(result)
    }

    getProduct = async (req, res) => {
        const { pid } = req.params
        const product = await this.#productService.getProductById(pid)
        
        res.sendSuccess(product)
    }

    addProduct = async (req, res) => {
        const { title, description, price, stock, thumbnail } = req.body
        if (!title || !description || !price || !stock) {
            CustomError.createError({
                name: 'Missing parameters',
                cause:  generateProductsError( {title, description, price, stock}),
                message: 'Error adding the product',
                code: EError.INVALID_TYPE_ERROR
            })
        } else {
            const product = {
                title,
                description,
                price,
                stock,
                thumbnail: thumbnail ?? ['default_thumbnail.jpg'],
                owner: req.user.email,
                status: true
            }
            const newProduct = await this.#productService.addProduct(product)
            res.sendSuccess(newProduct)
        }
    }

    updateProduct = async (req, res) => {
        const { pid } = req.params
        const {key, newValue} = req.body
        const result = await this.#productService.updateProduct(pid, key, newValue)
        res.sendSuccess(result)
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params
        const owner = req.user
        const result = await this.#productService.deleteProduct(pid, owner)
        res.sendSuccess(result)
    }

}

export default ProductsController