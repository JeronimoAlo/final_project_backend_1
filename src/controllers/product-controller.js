import { productRepository } from '../repositories/product-repository.js';
import { CustomError } from '../utils/custom-error.js';

class ProductController {
    constructor(repository) {
        this.repository = repository;

        // Bindeamos los métodos para asegurar que 'this' se refiera a la instancia del 
        // controlador en cada uno de ellos.
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getById = this.getById.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    // Endpoint para obtener todos los productos de la tienda.
    async getAllProducts(req, res, next) {
        try {
            const products = await this.repository.getAllProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    // Endpoint para obtener un producto por su ID.
    async getById(req, res, next) {
        try {
            const { pid } = req.params;
            const product = await this.repository.getById(pid);

            if (!product) {
                throw new CustomError('Producto no encontrado', 404);
            }

            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    // Endpoint para agregar un nuevo producto.
    async addProduct(req, res, next) {
        try {
            const product = await this.repository.addProduct(req.body);

            // Emitir actualización a todos los clientes conectados.
            const io = req.app.get('io');
            if (io) {
                const products = await this.repository.getAllProducts();
                io.emit('products:list', products);
            }

            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    // Endpoint para actualizar un producto existente.
    async update(req, res, next) {
        try {
            const { pid } = req.params;
            const updatedProduct = await this.repository.update(pid, req.body);

            if (!updatedProduct) {
                throw new CustomError('Producto no encontrado para actualizar', 404);
            }

            res.json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }

    // Endpoint para eliminar un producto.
    async delete(req, res, next) {
        try {
            const { pid } = req.params;
            const deleted = await this.repository.delete(pid);

            if (!deleted) {
                throw new CustomError('Producto no encontrado para eliminar', 404);
            }

            // Emitir actualización a todos los clientes conectados.
            const io = req.app.get('io');
            if (io) {
                const products = await this.repository.getAllProducts();
                io.emit('products:list', products);
            }

            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController(productRepository);
