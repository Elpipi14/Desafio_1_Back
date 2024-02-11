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

//busca todos los productos o se puede buscar por cantidad.
app.get("/products", (req, res) => {
    try {
        let limit = req.query.limit;
        let products;
        if (limit) {
            products = productsManager.getProducts().slice(0, limit);
        } else {
            products = productsManager.getProducts();
        }
        res.send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send({status: 500, message: "Error interno del servidor"});
    }
});

// busca por Id
app.get("/products/:id", (req, res)=>{
    try{
    let id = req.params.id 
    const products = productsManager.getProductById(id);
    res.send(products);
    }catch(error){
        console.error(error);
        res.send({status:404, message: "no hay producto con ese id"});
    }
});

//crear producto
app.post("/products", (req,res)=>{
    //crea el cliente por body
    const product = { ...req.body };
    console.log(product);
    const newProduct = productsManager.addProduct(product);
    //verifica
    console.log(newProduct);
    res.send({status:"succes", message: "Cliente creado"});
})

//modifica el producto buscado por id
app.put('/products/:id', async (req, res) => {
    try {
        const product = { ...req.body };
        // console.log('product', product);
        const { id } = req.params;
        const idNumber = Number(id);
        const productOk = productsManager.getProductById(idNumber);
        if (!productOk) res.status(404).json({ message: 'product not found' });
        else
            await productsManager.updateProduct(idNumber, product);
        res.status(200).json({ message: `product id: ${id} updated` })
    } catch (error) {
        res.status(500).json(error.message);
    }
});

//Elimina el producto por id
app.delete("/products/:id", (req, res)=>{
    try {
        const { id } = req.params;
        const idNumber = Number(id);
        productsManager.deleteProduct(idNumber)
        res.json({ message: `product id: ${idNumber} deleted` })
    } catch (error) {
        res.status(500).json(error.massage);
    }
})


