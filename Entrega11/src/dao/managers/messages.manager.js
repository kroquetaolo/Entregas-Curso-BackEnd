import { messagesModel } from './models/messages.model.js';

export default class MessagesManager {

    constructor() {
        this.model = messagesModel;
    }

    async getMessages() {
        const result = await this.model.find({})
        return result
    }

    async updateMessages(data) {
        try {
            await this.model.create({user: data.user, message: data.message});
        } catch (error) {
            console.error(error.message)
        }
    }

}