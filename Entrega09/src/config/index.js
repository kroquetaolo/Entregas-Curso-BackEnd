import { connect } from "mongoose"

export const connectDB = () => {
    connect('mongodb+srv://user:iFNVqxDMwG9Gs4Si@ecommerce.lrmmnhj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce')
    console.log('base de datos conectada ;D')
}