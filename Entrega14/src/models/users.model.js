import { Schema, model } from "mongoose";

const colection_name = "users";
const schema = new Schema({
    fullname: {
        type: String,
        trim: true,
        require: true
    },
    first_name: {
        type: String,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: String,
    age: Date,
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: String,
        ref: 'carts'
    }
})

schema.pre(['find'], function(){
    this.populate('cart')
})

export const usersModel = model(colection_name, schema);