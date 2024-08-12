import { usersService } from "../service/index.js";

class UsersController {
    #usersService
    constructor() {
        this.#usersService = usersService
    }

    switchUserRol = async (req, res) => {
        const { uid } = req.params
        let result 
        try {
            result = await this.#usersService.switchUserRol(uid)
        } catch (error) {
            result = error.message
        }
        res.sendSuccess(result)
    }

}

export default UsersController