import { Schema, model } from "mongoose";

const colection_name = "users";
const schema = new Schema({
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
        default: 'user'
    }
})

export const usersModel = model(colection_name, schema);