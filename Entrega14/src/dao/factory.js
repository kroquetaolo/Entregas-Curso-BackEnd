import config, { connectDB } from '../config/config.js'
import { logger } from '../utils/winston.logger.js';

export async function services() {

    let CartsDao, MessagesDao, ProductsDao, UsersDao, TicketsDao

    switch(config.persistance) {

        case 'MEMORY':

            break;
        case 'FS':

            break;
        default: //MONGODB
            connectDB()
            logger.info('default connection');

            const { default: CartsDaoMongo } = await import("./MONGODB/carts.dao.js");
            const { default: MessagesDaoMongo } = await import("./MONGODB/messages.dao.js");
            const { default: UsersDaoMongo } = await import("./MONGODB/users.dao.js");
            const { default: ProductsDaoMongo } = await import("./MONGODB/products.dao.js");
            const { default: TicketsDaoMongo } = await import("./MONGODB/tickets.dao.js");

            MessagesDao = MessagesDaoMongo
            ProductsDao = ProductsDaoMongo
            UsersDao = UsersDaoMongo
            CartsDao = CartsDaoMongo
            TicketsDao = TicketsDaoMongo

            break;
    }

    return { CartsDao, MessagesDao, ProductsDao, UsersDao, TicketsDao}
}