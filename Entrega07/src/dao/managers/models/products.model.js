import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const colection_name = 'products'
const schema = new Schema({
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

schema.plugin(mongoosePaginate)

export const productsModel = model(colection_name, schema)