# Final Project Backend 1

API REST para gestionar productos y carritos, con persistencia en MongoDB.

## Instalacion
```bash
npm install
```

## Ejecucion
Antes de iniciar el proyecto, definir la variable de entorno `MONGO_URL` en un archivo `.env`.

Luego ejecutar:

```bash
npm start
```

Servidor por defecto: `http://localhost:8080`

## Persistencia
Los datos se almacenan y persisten en MongoDB mediante Mongoose.

Modelos utilizados:
- `src/models/product-model.js`
- `src/models/cart-model.js`

Para productos se utiliza tambien `mongoose-paginate-v2` para paginacion.

## Vistas (Handlebars)
Se agrego una vista en Handlebars para productos en tiempo real:
- `GET /realtimeproducts` renderiza `realTimeProducts.handlebars` y utiliza websockets.
- La vista muestra la lista inicial de productos.

Ademas se agrega una vista estatica:
- `GET /home` renderiza `home.handlebars` con la lista de productos sin websockets.
- `GET /` redirige a `/home`.

## WebSockets (Socket.IO)
La vista `realTimeProducts` se actualiza automaticamente cuando:
- Se crea un producto.
- Se elimina un producto.

Eventos usados:
- Servidor emite `products:list` con la lista actualizada.

## Endpoints

### Productos
- `GET /api/products`
  Lista productos con paginacion, filtros y ordenamiento.

  Query params disponibles:
  - `limit` (opcional, default `10`)
  - `page` (opcional, default `1`)
  - `sort` (opcional, `asc` o `desc`, ordena por `price`)
  - `query` (opcional, filtra por `category` o por `status` cuando vale `true` o `false`)

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

- `PUT /api/products/:pid`
  Actualiza un producto con los campos enviados. No permite modificar el `id`.

- `DELETE /api/products/:pid`
  Elimina un producto por id.

### Carritos
- `POST /api/carts`
  Crea un carrito con la estructura:
  - `products` (array)

- `GET /api/carts/:cid`
  Lista los productos de un carrito utilizando `populate` sobre `products.product`.

- `POST /api/carts/:cid/products/:pid`
  Agrega un producto al carrito.
  - Si el producto ya existe en el carrito, incrementa `quantity` en 1.
  - Si no existe, lo agrega con `quantity: 1`.

- `DELETE /api/carts/:cid`
  Vacia todos los productos del carrito.

- `DELETE /api/carts/:cid/products/:pid`
  Elimina una unidad del producto seleccionado en el carrito.
  - Si `quantity` es mayor a 1, decrementa en 1.
  - Si `quantity` es 1, elimina el producto del carrito.

- `PUT /api/carts/:cid`
  Reemplaza todos los productos del carrito por el arreglo enviado en `req.body.products`.

  Formato esperado:
  ```json
  {
    "products": [
      {
        "product": "productId",
        "quantity": 2
      }
    ]
  }
  ```

- `PUT /api/carts/:cid/products/:pid`
  Actualiza solo la cantidad de un producto especifico del carrito.

  Formato esperado:
  ```json
  {
    "quantity": 3
  }
  ```

## Notas
- Incluye una vista en tiempo real para productos en `/realtimeproducts`.
- El proyecto utiliza MongoDB como persistencia principal.
- Las validaciones verifican ids validos, existencia de productos y cantidades enteras positivas en carrito.
