import CustomRouter from "../router.js"
import UserController from "../../controllers/users.controller.js"

export default class UsersRouter extends CustomRouter {

    init() {

        const {
            switchUserRol
        } = new UserController()

        this.post('/premium/:uid', ['ADMIN'], switchUserRol)

    }
}