import { Router } from 'express';
import { cartController } from '../controllers/cart-controller.js';
import { CustomError } from '../utils/custom-error.js';

const cartsRouter = Router();

cartsRouter.get('/:cid', cartController.listProductsInCart);
cartsRouter.post('/', cartController.addCart);
cartsRouter.post('/:cid/products/:pid', cartController.addProductToCart);
cartsRouter.delete('/:cid', cartController.deleteCart);
cartsRouter.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
cartsRouter.put('/:cid', cartController.updateCartProducts);
cartsRouter.put('/:cid/products/:pid', cartController.updateProductQuantity);

export default cartsRouter;
