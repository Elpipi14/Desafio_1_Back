// crear servidor express
import express from "express";
const PORT = 8080;

// creando una nueva instancia de la aplicación Express
const app = express();

//indicar al servidor que comience a escuchar las solicitudes
app.listen(PORT, () => {
    console.log(`escuchando al puerto ${PORT}`);
});

//Este middleware cuando una solicitud llega al servidor con un cuerpo en formato JSON. 
//este middleware lo analiza y lo convierte en un objeto JavaScript 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Importacion de producManager
import { ProductManager } from "./productManager.js";
const productsManager = new ProductManager()

//busca todos los productos y busca por cantidad /products?limit=
app.get("/products", (req, res) => {
    try {
        let limit = req.query.limit;
        let products;
        if (limit) {
            products = productsManager.getProducts().slice(0, limit);
        } else {
            products = productsManager.getProducts();
        };
        res.send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send({status: 500, message: "Error interno del servidor"});
    };
});

// busca por Id
app.get("/products/:id", (req, res)=>{
    try{
    let id = req.params.id; 
    const products = productsManager.getProductById(id);
    res.send(products);
    }catch(error){
        res.status(404).json({ status: "error", message: error.message });
    };
});

//crear producto
app.post("/products", (req, res) => {
    try {
        // Obtener los datos del producto del cuerpo de la solicitud
        const productData = req.body;

        // Agregar el producto
        const newProduct = productsManager.addProduct(productData);

        // Verificar si el producto se agregó correctamente
        if (newProduct) {
            res.status(201).json({ status: "success", message: "Product created", product: newProduct });
        }; 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    };
});

//modifica el producto buscado por id
app.put('/products/:id', async (req, res) => {
    try {
        const product = { ...req.body };
        // console.log('product', product);
        const { id } = req.params;
        const idNumber = Number(id);
        const productOk = productsManager.getProductById(idNumber);
        //Verifica la modificaciòn del producto
        if (!productOk) {
            res.status(404).json({ message: 'product not found' })
        } else{
            await productsManager.updateProduct(idNumber, product)
            res.status(200).json({ message: `product id: ${id} updated` })
        };
    } catch (error) {
        res.status(500).json(error.message);
    };
});

//Elimina el producto por id
app.delete("/products/:id", (req, res) => {
    try {
        const { id } = req.params;
        const idNumber = Number(id);
        const productToDelete = productsManager.getProductById(idNumber);
         // Verificar si el producto si se elimino
        if (productToDelete) {
            productsManager.deleteProduct(idNumber);
            res.json({ message: `Product id: ${idNumber} deleted` });
        } else {
            res.status(404).json({ message: `Product with id ${idNumber} not found` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


