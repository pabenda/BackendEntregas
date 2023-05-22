const express = require("express");
const cartRouter = express.Router();
const CartManager = require("../models/cartManager");

const cartManager = new CartManager("./carts.json");

// Obtener todos los carritos
cartRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Obtener un carrito por ID
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).send(`Carrito con ID ${cartId} no se encuentra`);
    } else {
      res.json(cart);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Agregar un nuevo carrito
cartRouter.post("/", async (req, res) => {
  try {
    const cart = req.body;
    await cartManager.addCart(cart);
    res.send("Carrito agregado exitosamente");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Actualizar un carrito por ID
cartRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = req.body;
    await cartManager.updateCart(cartId, cart);
    res.send("Carrito actualizado exitosamente");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Eliminar un carrito por ID
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    await cartManager.deleteCart(cartId);
    res.send("Carrito eliminado exitosamente");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = cartRouter;

  
