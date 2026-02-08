# Final Project Backend 1

API REST para gestionar productos y carritos, con persistencia en archivos JSON.

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm start
```

Servidor por defecto: `http://localhost:8080`

## Persistencia
Los datos se almacenan y persisten en:
- `data/products.json`
- `data/carts.json`

## Vistas (Handlebars)
Se agregó una vista en Handlebars para productos en tiempo real:
- `GET /realtimeproducts` renderiza `realTimeProducts.handlebars` y utiliza websockets.
- La vista muestra la lista inicial de productos.

Además se agrega una vista estática:
- `GET /home` renderiza `home.handlebars` con la lista de productos sin websockets.
- `GET /` redirige a `/home`.

## WebSockets (Socket.IO)
La vista `realTimeProducts` se actualiza automáticamente cuando:
- Se crea un producto.
- Se elimina un producto.

Eventos usados:
- Servidor emite `products:list` con la lista actualizada.

## Endpoints

### Productos
- `GET /api/products`  
  Lista todos los productos.
- `GET /api/products/:pid`  
  Obtiene un producto por id.
- `POST /api/products`  
  Crea un producto. Campos requeridos:
  - `title` (string)
  - `description` (string)
  - `code` (string)
  - `price` (number)
  - `status` (boolean)
  - `stock` (number)
  - `category` (string)
  - `thumbnails` (array de strings)

  `id` se autogenera en el servidor.
- `PUT /api/products/:pid`  
  Actualiza un producto con los campos enviados. No permite modificar el `id`.
- `DELETE /api/products/:pid`  
  Elimina un producto por id.

### Carritos
- `POST /api/carts`  
  Crea un carrito con la estructura:
  - `id` (autogenerado)
  - `products` (array)
- `GET /api/carts/:cid`  
  Lista los productos de un carrito.
- `POST /api/carts/:cid/product/:pid`  
  Agrega un producto al carrito. Formato en `products`:
  - `product` (id del producto)
  - `quantity` (se incrementa de a 1 si ya existe)

## Notas
- Incluye una vista en tiempo real para productos en `/realtimeproducts`.
