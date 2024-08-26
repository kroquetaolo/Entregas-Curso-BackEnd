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
        if(!this.checkDocument()) {
            return  {
                message: 'Cannot change the user rol, you must first upload your DNI, CD and CEC'
            }
        }
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

    async updateConnection(_id) {
        let result;
        try {
            result = await this.model.updateOne({_id}, {last_connection: Date.now()} )
        } catch (error) {
            result = {
                message: 'Cannot change the user last_connection, try again or contact the administrator', 
                result: error.message,
            };
        }
        return result
    }

    async updateDocuments(_id, filter) {
        let result        
        const reference =  `uploads/users/${_id}/${filter.type}/${filter.file.filename}`

        const name = filter.document_type
        try {
            const doc = await this.model.findOne({ _id, "documents.name": name });
            if (doc) {
                result = await this.model.updateOne(
                    { _id, "documents.name": name },
                    { $set: { "documents.$.reference": reference } }
                );
            } else {
                result = await this.model.findByIdAndUpdate(
                    { _id },
                    { $push: { documents: { name, reference } } }
                );
            }
        } catch (error) {
            result = {
                message: 'Cannot update the document, try again or contact the administrator', 
                result: error.message,
            };
        }
        
        return result
    }

    async checkDocument(_id) {
        let result
        const required_docs = ['CD', 'DNI', 'CEC'];
        try {
            const user = await this.model.findOne({_id})
            const docs = user.documents.map(doc => doc.name);
            result = required_docs.every(doc => docs.includes(doc));
        } catch (error) {
            result = {
                message: 'Cannot check the documents, try again or contact the administrator', 
                result: error.message,
            };
        }
        return result
    }

}