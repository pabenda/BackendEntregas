const fs = require("fs").promises;

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Error al obtener los carritos");
    }
  }

  async getCartById(cartId) {
    try {
      const carts = await this.getCarts();
      return carts.find((cart) => cart.id === cartId);
    } catch (error) {
      throw new Error(`Error al obtener el carrito con ID ${cartId}`);
    }
  }

  async addCart(cart) {
    try {
      const carts = await this.getCarts();
      cart.id = this.generateId(carts);
      carts.push(cart);
      await this.saveCarts(carts);
    } catch (error) {
      throw new Error("Error al agregar el carrito");
    }
  }

  async updateCart(cartId, updatedCart) {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id === cartId);
      if (index !== -1) {
        updatedCart.id = cartId;
        carts[index] = updatedCart;
        await this.saveCarts(carts);
      } else {
        throw new Error(`No se encontró el carrito con ID ${cartId}`);
      }
    } catch (error) {
      throw new Error(`Error al actualizar el carrito con ID ${cartId}`);
    }
  }

  async deleteCart(cartId) {
    try {
      const carts = await this.getCarts();
      const updatedCarts = carts.filter((cart) => cart.id !== cartId);
      if (carts.length !== updatedCarts.length) {
        await this.saveCarts(updatedCarts);
      } else {
        throw new Error(`No se encontró el carrito con ID ${cartId}`);
      }
    } catch (error) {
      throw new Error(`Error al eliminar el carrito con ID ${cartId}`);
    }
  }

  async saveCarts(carts) {
    try {
      const data = JSON.stringify(carts, null, 2);
      await fs.writeFile(this.filePath, data);
    } catch (error) {
      throw new Error("Error al guardar los carritos");
    }
  }

  generateId(carts) {
    const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
    return maxId + 1;
  }
}

module.exports = CartManager;

