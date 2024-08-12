import { usersModel } from "../../models/users.model.js";

export default class UserDao {
    constructor(cartService) {
        this.model = usersModel;
        this.cartService = cartService;
    }

    async getAll() {
        return await this.model.find().lean()
    }

    async create(user) {
        let result
        try {
            const cart = await this.cartService.newCart()
            user.cart = cart._id
            result = {
                message: 'User created successfully',
                result: await this.model.create(user)
            };
        } catch (error) {
            result = {
                message: 'Cannot create user, try again or contact the administrator', 
                result: error.message,
            };
        }
        return result;
    }

    async getPopulated(_id) {
        let result 
        try {
            result = await this.model.find({_id}).populate('cart').lean();
        } catch (error) {
            result = undefined;
        }
        return result;
    }

    async getBy(filter) {
        let result;
        try {
            result = await this.model.findOne(filter);
        } catch (error) {
            result = false
        }
        return result;
    }

    async changePassword(_id, password) {
        let result;
        try {
            result = await this.model.updateOne({_id}, {password} )
        } catch (error) {
            result = {
                message: 'Cannot change the user password, try again or contact the administrator', 
                result: error.message,
            };
        }
        return result
    }

    async switchRol(_id) {
        let result 
        try {
            const user = await this.model.findOne({_id})
            let rol
            if(user.rol.toUpperCase() === 'ADMIN') {
                result = {
                    message: 'the user rol cannot be admin'
                }
            } else {
                user.rol.toUpperCase() === 'PREMIUM' ? rol = 'user' : rol = 'premium'
            }
            result = await this.model.updateOne({_id}, {rol})
        } catch (error) {
            result = {
                message: 'Cannot change the user rol, try again or contact the administrator', 
                result: error.message,
            }
            
        }
        return result
    }

}