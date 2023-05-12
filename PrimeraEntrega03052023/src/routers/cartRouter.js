const express = require("express");
const cartRouter = express.Router();

// Array de carritos (por simplicidad, se almacenan en memoria)
let carts = [];

// Endpoint para obtener todos los carritos
cartRouter.get("/", (req, res) => {
  res.json(carts);
});

// Endpoint para obtener un carrito por ID
cartRouter.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find((cart) => cart.id === cartId);
  if (!cart) {
    res.status(404).send(`Carrito con ID ${cartId} no se encuentra`);
  } else {
    res.json(cart);
  }
});

// Endpoint para crear un nuevo carrito
cartRouter.post("/", (req, res) => {
  const cart = req.body;
  // Validar si ya existe un carrito con el mismo ID
  const existingCart = carts.find((c) => c.id === cart.id);
  if (existingCart) {
    res.status(400).send(`Carrito con ID ${cart.id} ya existe`);
  } else {
    carts.push(cart);
    res.send("Carrito creado exitosamente");
  }
});

// Endpoint para actualizar un carrito por ID
cartRouter.put("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const updatedCart = req.body;
  // Buscar el carrito a actualizar
  const index = carts.findIndex((cart) => cart.id === cartId);
  if (index === -1) {
    res.status(404).send(`Carrito con ID ${cartId} no se encuentra`);
  } else {
    // Validar si el ID del carrito se actualiza
    if (updatedCart.id && updatedCart.id !== cartId) {
      const existingCart = carts.find((c) => c.id === updatedCart.id);
      if (existingCart) {
        res.status(400).send(`Carrito con ID ${updatedCart.id} ya existe`);
        return;
      }
    }
    // Actualizar el carrito
    carts[index] = { ...carts[index], ...updatedCart };
    res.send(`Carrito con ID ${cartId} actualizado exitosamente`);
  }
});

// Endpoint para eliminar un carrito por ID
cartRouter.delete("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const initialLength = carts.length;
  carts = carts.filter((cart) => cart.id !== cartId);
  if (carts.length === initialLength) {
    res.status(404).send(`Carrito con ID ${cartId} no se encuentra`);
  } else {
    res.send(`Carrito con ID ${cartId} eliminado exitosamente`);
  }
});

module.exports = cartRouter;
