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

}