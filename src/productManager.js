import fs from "fs"

export class ProductManager {
  constructor() {
    this.path = './src/data/products.json';
    this.id = 1;
  };

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.log("All fields are required");
        throw new Error("All fields are required");
    }

    // Leer productos existentes
    let products = this.getAllFileProducts();

    // Validar que no se repita el campo "code"
    if (products.some(existingProduct => existingProduct.code === product.code)) {
        console.log("A product with the same code already exists");
        throw new Error("A product with the same code already exists");
    }

    // Encontrar el máximo ID actual
    let maxId = products.length > 0 ? Math.max(...products.map(product => product.id)) : 0;

    // Agregar el producto con id autoincrementable
    const newProduct = {
        id: maxId + 1,
        ...product
    };
    products.push(newProduct);

    // Guardar en archivo
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));

    console.log("Product added successfully:", newProduct);

    // Devolver el producto agregado
    return newProduct;
};

  //lee archivo json
  getAllFileProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data) || [];
    } catch (err) {
      return [];
    };
  };

  //muestra todos los productos 
  getProducts() {
    return this.getAllFileProducts();
  };

  //busca por id
  getProductById(id) {
    const products = this.getAllFileProducts();
    const product = products.find(product => product.id === parseFloat(id));
    if (product) {
      return product;
    } else {
      console.error("Product not found");
      throw new Error("Product not found");
    };
  };

  // actualiza productos buscando por id
  updateProduct(id, updatedProduct) {
    let products = this.getAllFileProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      fs.writeFileSync(this.path, JSON.stringify(products));
      console.log("Successfully updated product:", products[index]);
    } else {
      console.error("Product not found");
    };
  };

  //elimina el producto
  deleteProduct(id) {
    let products = this.getAllFileProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    if (filteredProducts.length < products.length) {
      fs.writeFileSync(this.path, JSON.stringify(filteredProducts));
      console.log("Product removed");
    } else {
      console.error("Product not found");
    };
  };
};

// Test
// const productManager = new ProductManager();

// productManager.addProduct({
//   title: "Pc",
//   description: "Pc gamer tope de gama",
//   price: 500,
//   thumbnail: "imagen1.jpg",
//   code: "AB001",
//   stock: 50
// });

// productManager.addProduct({
//   title: "Iphone 14 pro",
//   description: "Iphone de 256gb",
//   price: 1500,
//   thumbnail: "imagen2.jpg",
//   code: "AB002",
//   stock: 30
// });

// productManager.addProduct({
//   title: "Tablet Pro",
//   description: "Lenovo de 256gb",
//   price: 700,
//   thumbnail: "imagen3.jpg",
//   code: "AB003",
//   stock: 30
// });

// productManager.addProduct({
//   title: "Tablet Pro",
//   description: "Lenovo de 256gb",
//   price: 800,
//   thumbnail: "imagen4.jpg",
//   code: "AB004",
//   stock: 30
// });

// //trata de crear un producto con el mismo codigo de otro producto
// productManager.addProduct({
//   title: "TV LED",
//   description: "55 pulgadas",
//   price: 1800,
//   thumbnail: "imagen5.jpg",
//   code: "AB004",
//   stock: 15
// });

// //Crear un producto un campo menos
// productManager.addProduct({
//   title: "TV LED",
//   price: 1800,
//   thumbnail: "imagen5.jpg",
//   code: "AB004",
//   stock: 15
// });

// //muestra todos los productos creado
// console.log("Todos los productos:", productManager.getProducts());

// //buscar por id
// console.log("Buscar producto por id:", productManager.getProductById(2));

// //actualizar producto
// productManager.updateProduct(2, { price: 1600 });

// //eliminar producto
// productManager.deleteProduct(4);
// console.log("Productos después de eliminar uno:", productManager.getProducts());
