const fs = require('fs');

class ProductManager {
  constructor() {
    this.path = 'products.json';
    this.id = 1;
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    // Leer productos existentes
    let products = this.getAllFileProducts();

    // Validar que no se repita el campo "code"
    if (products.some(existingProduct => existingProduct.code === product.code)) {
      console.log("Ya existe un producto con el mismo código");
      return;
    }

    // Agregar el producto con id autoincrementable
    product.id = this.id++;
    products.push(product);

    // Guardar en archivo
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));

    console.log("Producto agregado correctamente:", product);
  }

  //lee archivo json
  getAllFileProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data) || [];
    } catch (err) {
      return [];
    }
  }

  //muestra todos los productos
  getProducts() {
    return this.getAllFileProducts();
  }

  //busca por id
  getProductById(id) {
    const products = this.getAllFileProducts();
    const product = products.find(product => product.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
    }
  }

  // actualiza productos buscando por id
  updateProduct(id, updatedProduct) {
    let products = this.getAllFileProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      fs.writeFileSync(this.path, JSON.stringify(products));
      console.log("Producto actualizado correctamente:", products[index]);
    } else {
      console.error("Producto no encontrado");
    }
  }

  //elimina el producto
  deleteProduct(id) {
    let products = this.getAllFileProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    if (filteredProducts.length < products.length) {
      fs.writeFileSync(this.path, JSON.stringify(filteredProducts));
      console.log("Producto eliminado correctamente");
    } else {
      console.error("Producto no encontrado");
    }
  }
}

// Test
const productManager = new ProductManager();

productManager.addProduct({
  title: "Pc",
  description: "Pc gamer tope de gama",
  price: 500,
  thumbnail: "imagen1.jpg",
  code: "AB001",
  stock: 50
});

productManager.addProduct({
  title: "Iphone 14 pro",
  description: "Iphone de 256gb",
  price: 1500,
  thumbnail: "imagen2.jpg",
  code: "AB002",
  stock: 30
});

productManager.addProduct({
  title: "Tablet Pro",
  description: "Lenovo de 256gb",
  price: 700,
  thumbnail: "imagen3.jpg",
  code: "AB003",
  stock: 30
});

productManager.addProduct({
  title: "Tablet Pro",
  description: "Lenovo de 256gb",
  price: 800,
  thumbnail: "imagen3.jpg",
  code: "AB004",
  stock: 30
});

console.log("Todos los productos:", productManager.getProducts());

console.log("Buscar producto por id:", productManager.getProductById(2));

productManager.updateProduct(2, { price: 1600 });


productManager.deleteProduct(4);
console.log("Productos después de eliminar uno:", productManager.getProducts());
