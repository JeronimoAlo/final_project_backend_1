import { Router } from 'express';
import { cartManager } from '../managers/cart-manager.js';

const cartsRouter = Router();

// Endpoint para crear un nuevo carrito.
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear el carrito' });
    }
});

// Endpoint para obtener los productos en un carrito por su ID.
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const products = await cartManager.listProductsInCart(cid);
        res.status(200).send(products);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default cartsRouter;
