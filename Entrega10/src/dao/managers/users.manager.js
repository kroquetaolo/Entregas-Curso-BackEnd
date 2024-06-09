import CartsManager from "./carts.manager.js";
import { usersModel } from "./models/users.model.js";

const cartService = new CartsManager()

export default class UserManager {
    constructor() {
        this.model = usersModel;
    }

    async getUsers() {
        return await this.model.find().lean()
    }

    async createUser(user) {
        let result
        try {
            const cart = await cartService.newCart()
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

    async getUserPopulate(_id) {
        let result 
        try {
            result = await this.model.find({_id}).populate('cart').lean();
        } catch (error) {
            result = undefined;
        }
        return result;
    }

    async getUserBy(filter) {
        let result;
        try {
            result = await this.model.findOne(filter);
        } catch (error) {
            result = false
        }
        return result;
    }

}