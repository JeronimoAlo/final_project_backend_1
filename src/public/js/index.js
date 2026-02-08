const socket = io();

const productsList = document.getElementById('products-list');

const renderProducts = (products) => {
  if (!productsList) return;
  if (!Array.isArray(products) || products.length === 0) {
    productsList.innerHTML = '<li>No hay productos</li>';
    return;
  }

  const html = products.map((prod) => {
    return `
      <li data-id="${prod.id}">
        <strong>${prod.title}</strong> - $${prod.price} (stock: ${prod.stock})
      </li>
    `;
  }).join('');

  productsList.innerHTML = html;
};

socket.on('products:list', (products) => {
  renderProducts(products);
});
