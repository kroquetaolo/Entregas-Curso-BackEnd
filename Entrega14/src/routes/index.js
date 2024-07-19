import { Router } from "express";

import ViewsRouter from './views.route.js';
import CartsRouter from './api/carts.route.js';
import ProductsRouter from './api/products.route.js';
import SessionsRouter from './api/sessions.route.js';
import TestsRouter from "./api/tests.router.js";

const router = Router();

const viewsRouter = new ViewsRouter()
const cartsRouter = new CartsRouter()
const productsRouter = new ProductsRouter()
const sessionsRouter = new SessionsRouter()
const testsRouter = new TestsRouter()

router.use('/api/carts', cartsRouter.getRouter())
router.use('/api/products', productsRouter.getRouter())
router.use('/api/sessions', sessionsRouter.getRouter())
router.use('/api/test', testsRouter.getRouter())

router.use('/', viewsRouter.getRouter())

export default router