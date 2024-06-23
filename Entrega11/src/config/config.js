import { connect } from "mongoose"
import dotenv from "dotenv"

export const connectDB = () => {
    connect('mongodb+srv://user:iFNVqxDMwG9Gs4Si@ecommerce.lrmmnhj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce')
    console.log('base de datos conectada ;D')
}

dotenv.config()

export default {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGODB_URL,
    cookiePassword: process.env.COOKIE_PASSWORD,
    sessionPasword: process.env.SESSION_PASSWORD,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    passportClientID: process.env.PASSPORT_CLIENT_ID,
    passportClientSecret: process.env.PASSPORT_CLIENT_SECRET
}