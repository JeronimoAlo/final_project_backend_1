import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getAllCarts() {
        if (!fs.existsSync(this.path)) return []; // Si el archivo no existe, retorna un array vacío.

        const data = await fs.promises.readFile(this.path, 'utf-8'); // Lee el contenido del archivo de forma sincrónica, esperando a que se complete la operación.
        return JSON.parse(data); // Lo devuelve parseado como un objeto JSON.
    }

    async getById(id) {
        try {
            const carts = await this.getAllCarts();
            const cart = carts.find((c) => c.id === id);

            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            throw error; // Re-lanza el error para que pueda ser manejado por el llamador, no es necesario envolverlo en otro Error.
        }
    }

    async addCart() {
        try {
            const carts = await this.getAllCarts();
            const newCart = {
                id: uuidv4(),
                products: []
            };
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async listProductsInCart(cartId) {
        try {
            const cart = await this.getById(cartId);
            return cart.products;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getAllCarts();
            const cartIndex = carts.findIndex((c) => c.id === cartId);

            if (cartIndex === -1) throw new Error('Carrito no encontrado');

            const productInCartIndex = carts[cartIndex].products.findIndex((p) => p.product === productId);

            if (productInCartIndex === -1) {
                carts[cartIndex].products.push({ product: productId, quantity: 1 }); // Si el producto no está en el carrito, lo agregamos con cantidad 1.
            } else {
                carts[cartIndex].products[productInCartIndex].quantity += 1; // Si ya está, incrementamos la cantidad.
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartIndex];
        } catch (error) {
            throw error;
        }
    }
}

export const cartManager = new CartManager('data/carts.json');

