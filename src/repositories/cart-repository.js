import mongoose from 'mongoose';
import { CartModel } from '../models/cart-model.js';
import { ProductModel } from '../models/product-model.js';

class CartRepository {
    constructor(model) {
        this.model = model;
    }

    async getAllCarts() {
        try {
            const carts = await this.model.find().populate('products.product');
            return carts;
        } catch (error) {
            throw new Error('Error al obtener carritos');
        }
    }

    async getById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Carrito no encontrado');
            }

            const cart = await this.model.findById(id).populate('products.product');

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addCart() {
        try {
            return await this.model.create({ products: [] });
        } catch (error) {
            throw new Error('Error al crear carrito');
        }
    }

    async listProductsInCart(cartId) {
        try {
            const cart = await this.getById(cartId);
            return cart.products;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('Carrito no encontrado');
            }

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('Producto no encontrado');
            }

            const [cart, product] = await Promise.all([
                CartModel.findById(cartId),
                ProductModel.findById(productId)
            ]);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const productInCart = cart.products.find(
                (item) => item.product.toString() === productId
            );

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();

            return await this.model.findById(cartId).populate('products.product');
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
}

export const cartRepository = new CartRepository(CartModel);
