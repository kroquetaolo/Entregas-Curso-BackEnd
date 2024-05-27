import { usersModel } from "./models/users.model.js";

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

    async getUserBy(filter) {
        let result;
        try {
            result = await this.model.findOne(filter);
        } catch (error) {
            // console.log(error.message);
            result = false
        }
        return result;
    }

}