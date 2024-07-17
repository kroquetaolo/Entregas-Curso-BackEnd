export default class ProductRepository {
    constructor(productDao) {
        this.productDao = productDao;
    }

    getProducts     = async (filter) => await this.productDao.getAll(filter);
    getProductById  = async (product_id) => await this.productDao.getById(product_id)
    addProduct      = async (product) => await this.productDao.add(product);
    updateProduct   = async (product_id, key, newValue) => await this.productDao.update(product_id, key, newValue)
    deleteProduct   = async (product_id) => await this.productDao.delete(product_id)
}