import { Router } from 'express';
import { productManager } from '../managers/product-manager.js';

const productsRouter = Router();

// Endpoint para obtener todos los productos de la tienda.
productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener productos' });
    }
});

// Endpoint para obtener un producto por su ID.
productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getById(pid);
        res.status(200).send(product);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// Endpoint para agregar un nuevo producto.
productsRouter.post('/', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);

        // Emitir actualización a todos los clientes conectados.
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getAllProducts();
            io.emit('products:list', products);
        }

        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para actualizar un producto existente.
productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productManager.update(pid, req.body);
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para eliminar un producto.
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await productManager.delete(pid);

        // Emitir actualización a todos los clientes conectados.
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getAllProducts();
            io.emit('products:list', products);
        }

        res.status(200).send({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default productsRouter;
