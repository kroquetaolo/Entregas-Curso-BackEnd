import CartsManager from "../dao/managers/carts.manager.js";
import ProductManager from "../dao/managers/product.manager.js";
import UserManager from "../dao/managers/users.manager.js";

export const cartsService = new CartsManager()
export const productsService = new ProductManager()
export const usersService = new UserManager()