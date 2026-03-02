import mongoose from 'mongoose';
import { ProductModel } from '../models/product-model.js';

const buildFilter = (query) => {
    if (!query) return {};

    if (query === 'true' || query === 'false') {
        return { status: query === 'true' };
    }

    return {
        // Con options: 'i' hacemos que la búsqueda sea case-insensitive
        category: { $regex: `^${query}$`, $options: 'i' }
    };
};

class ProductRepository {
    constructor(model) {
        this.model = model;
    }

    async getAllProducts(options) {
        try {
            // Si no pasamos opciones, devolvemos todos los productos sin paginar ni filtrar
            if (typeof options === 'undefined') {
                return await this.model.find();
            }

            const limit = Number.parseInt(options.limit, 10) || 10;
            const page = Number.parseInt(options.page, 10) || 1;
            const sort = options.sort === 'asc' || options.sort === 'desc'
                ? options.sort
                : undefined;
            const filter = buildFilter(options.query);

            const result = await this.model.paginate(filter, {
                limit,
                page,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
            });

            return result;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getById(id) {
        try {
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
                returnDocument: 'after',
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
