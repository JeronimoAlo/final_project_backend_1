import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getAllProducts() {
        if (!fs.existsSync(this.path)) return []; // Si el archivo no existe, retorna un array vacío.

        const data = await fs.promises.readFile(this.path, 'utf-8'); // Lee el contenido del archivo de forma sincrónica, esperando a que se complete la operación.
        return JSON.parse(data); // Lo devuelve parseado como un objeto JSON.
    }

    async getById(id) {
        try {
            const products = await this.getAllProducts();
            const product = products.find((p) => p.id === id);

            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw error; // Re-lanza el error para que pueda ser manejado por el llamador, no es necesario envolverlo en otro Error.
        }
    }

    async addProduct(body) {
        try {
            const products = await this.getAllProducts();
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
            const missingFields = requiredFields.filter((field) => body[field] === undefined); // Buscamos los campos obligatorios que faltan.

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

            if (!Array.isArray(body.thumbnails) || body.thumbnails.some((t) => typeof t !== 'string')) {
                throw new Error('thumbnails debe ser un array de strings');
            }

            const product = {
                id: uuidv4(),
                ...body
            };

            if (products.find((p) => p.code === product.code)) {
                throw new Error('El producto ya existe');
            }

            products.push(product); // Agregamos el nuevo producto al array de productos.
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); // Escribe los productos actualizados transformados en JSON con stringify.
            return product;
        } catch (error) {
            throw error;
        }
    }

    async update(id, obj) {
        try {
            const product = await this.getById(id);
            const products = await this.getAllProducts();

            const updatedProduct = { ...product, ...obj };
            const index = products.findIndex((p) => p.id === id); // Buscamos el índice del producto a actualizar.
            products[index] = updatedProduct; // Reemplazamos el producto en el array.

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); // Escribe los productos actualizados transformados en JSON con stringify.
            
            return products[index];
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const product = await this.getById(id);
            const products = await this.getAllProducts();

            const index = products.findIndex((p) => p.id === id); // Buscamos el índice del producto a eliminar.
            products.splice(index, 1); // Eliminamos el producto del array.

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); // Escribe los productos actualizados transformados en JSON con stringify.
            return product;
        } catch (error) {
            throw error;
        }
    }
}

export const productManager = new ProductManager('data/products.json');
