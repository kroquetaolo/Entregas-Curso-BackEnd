import { messagesService } from '../service/index.js';
import { socketServer } from '../server.js';

export function connectChatSocket() {
    socketServer.on('connection', async socket => {
        console.log('Cliente conectado al chat')
        let messages = await messagesService.getMessages()
        socketServer.emit('messageLogs', messages)
        socket.on('message', async data => {
            await messagesService.updateMessages(data)
            messages = await messagesService.getMessages()
            socketServer.emit('messageLogs', messages)
        })
    })
}