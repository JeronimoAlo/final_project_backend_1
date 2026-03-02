import mongoose from 'mongoose';
import { ProductModel } from '../models/product-model.js';

class ProductRepository {
    constructor(model) {
        this.model = model;
    }

    async getAllProducts() {
        try {
            return await this.model.find();
        } catch (error) {
            throw new Error('Error al obtener productos');
        }
    }

    async getById(id) {
        try {
            // chequea que el id sea un ObjectId válido antes de intentar buscar el producto.
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Producto no encontrado');
            }

            const product = await this.model.findById(id);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error('Error al obtener producto por id');
        }
    }

    async addProduct(body) {
        try {
            const requiredFields = [
                'title',
                'description',
                'code',
                'price',
                'status',
                'stock',
                'category',
                'thumbnails'
            ];
            const missingFields = requiredFields.filter((field) => body[field] === undefined);

            if (missingFields.length > 0) {
                throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
            }

            if (
                typeof body.title !== 'string' ||
                typeof body.description !== 'string' ||
                typeof body.code !== 'string' ||
                typeof body.category !== 'string'
            ) {
                throw new Error('title, description, code y category deben ser strings');
            }

            if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
                throw new Error('price debe ser un numero');
            }

            if (typeof body.status !== 'boolean') {
                throw new Error('status debe ser un booleano');
            }

            if (typeof body.stock !== 'number' || Number.isNaN(body.stock)) {
                throw new Error('stock debe ser un numero');
            }

            if (!Array.isArray(body.thumbnails) || body.thumbnails.some((thumbnail) => typeof thumbnail !== 'string')) {
                throw new Error('thumbnails debe ser un array de strings');
            }

            const existingProduct = await this.model.findOne({ code: body.code });
            if (existingProduct) {
                throw new Error('El producto ya existe');
            }

            return await this.model.create(body);
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async update(id, obj) {
        try {
            // Evita que se modifique el id del producto.
            if (Object.prototype.hasOwnProperty.call(obj, '_id') || Object.prototype.hasOwnProperty.call(obj, 'id')) {
                throw new Error('No se puede modificar el id del producto');
            }

            if (obj.code) {
                const existingProduct = await this.model.findOne({
                    code: obj.code,
                    _id: { $ne: id }
                });

                if (existingProduct) {
                    throw new Error('El producto ya existe');
                }
            }

            const updatedProduct = await this.model.findByIdAndUpdate(id, obj, {
                new: true,
                runValidators: true
            });

            if (!updatedProduct) {
                throw new Error('Producto no encontrado');
            }

            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Producto no encontrado');
            }

            const deletedProduct = await this.model.findByIdAndDelete(id);

            if (!deletedProduct) {
                throw new Error('Producto no encontrado');
            }

            return deletedProduct;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

export const productRepository = new ProductRepository(ProductModel);
