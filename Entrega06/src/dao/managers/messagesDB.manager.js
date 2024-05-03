import { messagesModel } from './models/messages.model.js';

export default class MessagesDBManager {

    async getMessages() {
        const result = await messagesModel.find({})
        return result
    }

    async updateMessages(data) {
        try {
            await messagesModel.create({user: data.user, message: data.message});
        } catch (error) {
            console.error(error.message)
        }
    }

}