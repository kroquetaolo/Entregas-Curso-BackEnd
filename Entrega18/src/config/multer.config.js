import multer from "multer";
import { __dirname } from "../path.js";
import path from "path"
import fs from "fs"

const createDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.body.type
        const user_id = req.params.uid || req.user._id
        let dir = path.join(__dirname, 'assets', 'users', user_id, type)
        if(type === 'document') dir = path.join(__dirname, 'uploads', 'users', user_id, type)
        cb(null, createDirectory(dir))
    },
    filename: function (req, file, cb) {
        let prefix = req.body.type
        const type = req.body.type
        const ext = path.extname(file.originalname);
        if(type === 'document') prefix = req.body.document_type
        cb(null, `${prefix}${ext}`)
    }
})

export default storage