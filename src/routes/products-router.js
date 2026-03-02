import { Router } from 'express';
import { productController } from '../controllers/product-controller.js';

const productsRouter = Router();

productsRouter.get('/', productController.getAllProducts);
productsRouter.get('/:pid', productController.getById);
productsRouter.post('/', productController.addProduct);
productsRouter.put('/:pid', productController.update);
productsRouter.delete('/:pid', productController.delete);

export default productsRouter;
