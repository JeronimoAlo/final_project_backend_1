import { cartRepository } from '../repositories/cart-repository.js';
import { CustomError } from '../utils/custom-error.js';

class CartController {
    constructor(repository) {
        this.repository = repository;
        this.addCart = this.addCart.bind(this);
        this.listProductsInCart = this.listProductsInCart.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.deleteCart = this.deleteCart.bind(this);
        this.deleteProductFromCart = this.deleteProductFromCart.bind(this);
        this.updateCartProducts = this.updateCartProducts.bind(this);
        this.updateProductQuantity = this.updateProductQuantity.bind(this);
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

    // Endpoint para eliminar el carrito completo por su ID.
    async deleteCart(req, res) {
        try {
            const { cid } = req.params;
            const emptiedCart = await this.repository.deleteCart(cid);
            res.status(200).send({
                message: 'Carrito vaciado correctamente',
                cart: emptiedCart
            });
        } catch (error) {
            res.status(404).send({ error: error.message });
        }
    }

    // Endpoint para eliminar un producto específico del carrito.
    async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await this.repository.deleteProductFromCart(cid, pid);
            res.status(200).send(updatedCart);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    // Endpoint para actualizar todos los productos del carrito con un nuevo arreglo de productos.
    async updateCartProducts(req, res) {
        try {
            const { cid } = req.params;

            if (!Array.isArray(req.body.products)) {
                throw new CustomError('El cuerpo de la solicitud debe contener un arreglo de productos', 400);
            }

            const newProducts = req.body.products; // Se espera un arreglo de productos en el cuerpo de la solicitud
            const updatedCart = await this.repository.updateCartProducts(cid, newProducts);
            res.status(200).send(updatedCart);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    // Endpoint para actualizar la cantidad de un producto específico del carrito.
    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (typeof quantity !== 'number' || quantity < 1) {
                throw new CustomError('La cantidad debe ser un número entero positivo', 400);
            }

            const updatedCart = await this.repository.updateProductQuantity(cid, pid, quantity);
            res.status(200).send(updatedCart);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}

export const cartController = new CartController(cartRepository);
