import { Schema, model } from 'mongoose'

const cartsSchema = new Schema({
    products: Array
})

export const cartsModel = model('carts', cartsSchema)