import { messagesService } from '../service/index.js';

export default class ChatSocket {
    constructor(socketServer) {
        this.messagesService = messagesService;
        this.socketServer = socketServer;
    }

    init() {
        this.socketServer.on('connection', async socket => {
            console.log('Cliente conectado al chat')
            let messages = await this.messagesService.getMessages()
            this.socketServer.emit('messageLogs', messages)
            socket.on('message', async data => {
                await this.messagesService.updateMessages(data)
                messages = await this.messagesService.getMessages()
                this.socketServer.emit('messageLogs', messages)
            })
        })
    }
}