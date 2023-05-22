const express = require("express");
const productRouter = express.Router();
const ProductManager = require("../models/productManager");

const productManager = new ProductManager("./products.json");

// Obtener todos los productos
productRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Obtener un producto por ID
productRouter.get("/:pid", async (req, res) => {
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

// Agregar un nuevo producto
productRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.send("Producto agregado exitosamente");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Actualizar un producto por ID
productRouter.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = req.body;
    await productManager.updateProduct(productId, product);
    res.send("Producto actualizado exitosamente");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = productRouter;
