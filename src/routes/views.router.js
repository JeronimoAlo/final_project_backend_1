import { Router } from 'express';
import { productManager } from '../managers/product-manager.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  try {
    res.redirect('/home');
  } catch (error) {
    res.status(500).send('Error al redirigir a home');
  }
});

viewsRouter.get('/home', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
});

export default viewsRouter;
