import { Router } from 'express';
import { cartController } from '../controllers/cart-controller.js';
import { CustomError } from '../utils/custom-error.js';

const cartsRouter = Router();

cartsRouter.post('/', cartController.addCart);
cartsRouter.get('/:cid', cartController.listProductsInCart);
cartsRouter.post('/:cid/product/:pid', cartController.addProductToCart);

export default cartsRouter;
