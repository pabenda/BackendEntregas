const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const handlebars = require("express-handlebars");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const ProductManager = require("./models/productManager");

const productManager = new ProductManager("./products.json");

// Configurando middleware para procesar solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurando el motor de plantillas Handlebars
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

// Configurando rutas de productos
app.use("/api/products", productRouter);

// Configurando rutas de carritos
app.use("/api/carts", cartRouter);

// Configurando el servidor de socket.io
io.on("connection", (socket) => {
  console.log("Nueva conexión de socket establecida");

  // Escuchando evento de creación de un nuevo producto
  socket.on("createProduct", async (product) => {
    try {
      await productManager.addProduct(product);
      io.emit("productCreated", product);
    } catch (error) {
      console.log(error);
    }
  });

  // Escuchando evento de eliminación de un producto
  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      io.emit("productDeleted", productId);
    } catch (error) {
      console.log(error);
    }
  });
});

// Inicio del servidor
const PORT = 8080;
http.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
