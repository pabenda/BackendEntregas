const express = require("express");
const app = express();
const ProductManager = require("./productManager");

const productManager = new ProductManager("./products.json");

// Verificación 1: Para obtener todos los productos, llame a http://localhost:8080/products sin query.
app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Verificación 2: Para obtener los primeros "limit" productos, llame a http://localhost:8080/products?limit=5.
app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Verificación 3: Para obtener un solo producto con el id especificado, llame a http://localhost:8080/products/2, donde "2" es el id del producto deseado.
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (!product) {
      res.status(404).send(`Producto con ID ${productId} no se encuentra`);
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Verificación 4: Para obtener un objeto de error si el producto no existe, llame a http://localhost:8080/products/34123123, donde "34123123" es un id de producto inexistente.
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: `Producto con ID ${productId} no se encuentra` });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
