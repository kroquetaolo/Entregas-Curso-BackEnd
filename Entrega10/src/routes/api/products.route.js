import ProductManager from '../../dao/managers/product.manager.js';
import CustomRouter from '../router.js';

export default class ProductsRouter extends CustomRouter {
    init() {

        const productService = new ProductManager()

        this.get('/', ['PUBLIC'], async (req, res) => {
            const { filter_key, filter_value, limit, page, sort_key, sort_value } = req.query
        
            const data = await productService.getProducts(filter_key, filter_value, limit, page, sort_key, sort_value)
        
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
        })
        
        this.get('/:pid', ['PUBLIC'], async (req, res) => {
            const { pid } = req.params
            const product = await productService.getProductById(pid)
            
            res.sendSuccess(product)
        })
        
        this.post('/', ['PUBLIC'], async (req, res) => {
            const {title, description, price, code, stock, thumbnail} = req.body
        
            if (!title || !description || !price || !code || !stock) {
                res.sendUserError(result)
            } else {
                const product = {
                    title,
                    description,
                    price,
                    code,
                    stock,
                    thumbnail: thumbnail ?? ['default_thumbnail.jpg'],
                    status: true
                }
                const newProduct = await productService.addProduct(product)
                res.sendSuccess(newProduct)
            }
        
        })
        
        this.put('/:pid', ['PUBLIC'], async (req, res) => {
            const { pid } = req.params
            const {key, newValue} = req.body
            const result = await productService.updateProduct(pid, key, newValue)
            res.sendSuccess(result)
        
        })
        
        this.delete('/:pid', ['PUBLIC'], async (req, res) => {
            const { pid } = req.params
            const result = await productService.deleteProduct(pid)
            res.sendSuccess(result)
        })

    }
}