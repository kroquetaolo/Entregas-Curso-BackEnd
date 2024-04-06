import { Router } from 'express'
import ProductManager from '../Utils/ProductManager.js';

const router = Router()
const productManager = new ProductManager('./products.json')
// productManager.loadDefaultProduct() //para cargar algunos product por defecto

// http://localhost:8080/api/products 
router.get('/', (req, res) => {
    const { limit } = req.query
    console.log('test');
    if(!limit) return res.send(productManager.getProducts())
    // http://localhost:8080/api/products?limit=5 <- ejemplo para limit 5
    res.json(productManager.limited(Number.parseInt(limit)))
})

// http://localhost:8080/api/products/14 <- mostrará solo el producto con ID 14 ;D
router.get('/:pid', (req, res) => {
    const { pid } = req.params
    const numberID = Number.parseInt(pid)
    res.json(productManager)
})

// URL para post: http://localhost:8080/api/products

/*  Ejemplo para post con thumbnail (body -> raw -> JSON)
{
    "name": "Aguacate",
    "description": "un aguacate maduro",
    "stock": 10,
    "code": "V016",
    "price": 150,
    "thumbnail": ["aguacate-Primary.jpg", "aguacate-Secundary.jpg"]
}
    Ejemplo para post sin thumbnail (body -> raw -> JSON)
{   
    "name": "Papaya",
    "description": "una papaya dulce",
    "stock": 8,
    "code": "V017",
    "price": 120
}
*/

router.post('/', (req, res) => {
    const {name, description, price, code, stock, thumbnail} = req.body
    const newProduct = thumbnail !== undefined ? 
        productManager.addProduct(name, description, price, code, stock, thumbnail)
        :
        productManager.addProduct(name, description, price, code, stock)
    if(newProduct !== typeof Object) {
        res.status(400).send({ status: 'failed', payload: newProduct })
    } else {
        res.status(201).send({ status: 'success', payload: newProduct })
    }
})

/* http://localhost:8080/api/products/16 <- Ejemplo para put ;D
{   
    "newValue": "Palta",
    "key": "tittle"
}
*/
router.put('/:pid', (req, res) => {
    const { pid } = req.params
    const {key, newValue} = req.body
    const numberID = Number.parseInt(pid)
    
    const update = productManager.updateProduct(numberID, key, newValue)

    if(update instanceof Object) {
        res.status(201).send({ status: 'success', payload: update })
    } else {
        res.status(400).send({ status: 'failed', payload: update })
    }
})

// http://localhost:8080/api/products/17 Ejemplo para delete (borrará el tulimo  (la papaya)) ;D
router.delete('/:pid', (req, res) => {
    const { pid } = req.params
    const numberID = Number.parseInt(pid)
    const deleted = productManager.deleteProduct(numberID)
    res.status(200).send({ status: 'success', payload: deleted })
})

export default router