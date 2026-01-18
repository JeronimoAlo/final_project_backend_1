import express from 'express';
import { productManager } from './managers/product-manager.js';
import { cartManager } from './managers/cart-manager.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para obtener todos los productos de la tienda.
app.get('/api/products', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener productos' });
    }
});

// Endpoint para obtener un producto por su ID.
app.get('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getById(pid);
        res.status(200).send(product);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// Endpoint para agregar un nuevo producto.
app.post('/api/products', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para actualizar un producto existente.
app.put('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productManager.update(pid, req.body);
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para eliminar un producto.
app.delete('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await productManager.delete(pid);
        res.status(200).send({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Endpoint para crear un nuevo carrito.
app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear el carrito' });
    }
});

// Endpoint para obtener los productos en un carrito por su ID.
app.get('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const products = await cartManager.listProductsInCart(cid);
        res.status(200).send(products);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
