import { cartRepository } from '../repositories/cart-repository.js';
import { CustomError } from '../utils/custom-error.js';

class CartController {
    constructor(repository) {
        this.repository = repository;
        this.addCart = this.addCart.bind(this);
        this.listProductsInCart = this.listProductsInCart.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
    }

    // Endpoint para crear un nuevo carrito.
    async addCart(req, res) {
        try {
            const newCart = await this.repository.addCart();
            res.status(201).send(newCart);
        } catch (error) {
            res.status(500).send({ error: 'Error al crear el carrito' });
        }
    }

    // Endpoint para obtener los productos en un carrito por su ID.
    async listProductsInCart(req, res) {
        try {
            const { cid } = req.params;
            const products = await this.repository.listProductsInCart(cid);
            res.status(200).send(products);
        } catch (error) {
            res.status(404).send({ error: error.message });
        }
    }

    // Endpoint para agregar un producto a un carrito.
    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await this.repository.addProductToCart(cid, pid);
            res.status(200).send(updatedCart);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}

export const cartController = new CartController(cartRepository);
