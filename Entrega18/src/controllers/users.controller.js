import { usersService } from "../service/index.js";
import { __dirname } from "../path.js";


class UsersController {
    #usersService
    constructor() {
        this.#usersService = usersService
    }

    switchUserRol = async (req, res) => {
        const { uid } = req.params
        const result = await this.#usersService.switchUserRol(uid)
        res.sendSuccess(result)
    }

    updateDocuments = async (req, res) => {
        if(!req.file) return res.render('errors/error', { type: 'upload error', error: 'No se subió ningún archivo.' })
        const user_id = req.params.uid
        if(req.user?.rol.toUpperCase() !== 'ADMIN' && user_id !== req.user?._id) return res.render('errors/error', { type: 'upload error', error: 'Can not update for that user.' })
        const { type, document_type } = req.body
        const result = await this.#usersService.updateDocuments(user_id, { type, document_type, file: req.file})
        res.sendSuccess(result)
        
    }
    checkDocument = async (req, res) => {
        const user_id = req.params.uid
        const result = await this.#usersService.checkDocument(user_id)
        res.sendSuccess(result)
    }
}

export default UsersController