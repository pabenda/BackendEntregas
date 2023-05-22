const express = require("express");
const app = express();
const productRouter = express.Router();
const cartRouter = express.Router();
const ProductManager = require("./models/productManager");

const productManager = new ProductManager("./products.json");

// Configurando middleware para procesar solicitudes JSON
app.use(express.json());

// Configurando rutas de productos
productRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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

productRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.send("Producto agregado exitosamente");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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

app.use("/api/products", productRouter);

// Configurando rutas de carritos
cartRouter.get("/", (req, res) => {
  res.send("Obteniendo todos los carritos");
});

cartRouter.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  res.send(`Obteniendo carrito con ID ${cartId}`);
});

cartRouter.post("/", async (req, res) => {
  try {
    const cart = req.body;
    // Aquí se debe agregar la lógica para verificar si ya existe un carrito con el mismo código
    res.send("Creando nuevo carrito");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

cartRouter.put("/:cid", (req, res) => {
  const cartId = req.params.cid;
  res.send(`Actualizando carrito con ID ${cartId}`);
});

cartRouter.delete("/:cid", (req, res) => {
  const cartId = req.params.cid;
  res.send(`Eliminando carrito con ID ${cartId}`);
});

app.use("/api/carts", cartRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
