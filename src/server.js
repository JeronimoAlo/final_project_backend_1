import express from 'express';
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { productManager } from './managers/product-manager.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
const socketServer = new Server(httpServer);

// Guardamos la instancia de Socket.IO en la aplicación para poder usarla en los routers.
app.set('io', socketServer);

socketServer.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado', socket.id);

  socket.on('disconnect', ()=>{
    console.log('Cliente desconectado', socket.id);
  })

  const products = await productManager.getAllProducts();
  socket.emit('products:list', products);
});
