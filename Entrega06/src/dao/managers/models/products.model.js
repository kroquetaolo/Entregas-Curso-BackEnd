import { Schema, model } from 'mongoose'

const productsSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: Number,
    status: Boolean,
})

export const productsModel = model('products', productsSchema)