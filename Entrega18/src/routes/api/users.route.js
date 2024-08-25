import CustomRouter from "../router.js"
import UserController from "../../controllers/users.controller.js"

export default class UsersRouter extends CustomRouter {

    init() {
        
        const {
            switchUserRol,
            updateDocuments,
            checkDocument
        } = new UserController()

        this.post('/premium/:uid', ['ADMIN'], switchUserRol)
        this.postStorage('/:uid/documents', ['PUBLIC'], updateDocuments)
        this.get('/test/:uid', ['PUBLIC'], checkDocument)
        
    }
}