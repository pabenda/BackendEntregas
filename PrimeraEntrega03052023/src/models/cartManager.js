const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.path = path;
    this._idCounter = 0;
  }

  async addCart(cart) {
    cart.id = ++this._idCounter;
    let carts = await this.getCarts();
    carts.push(cart);
    await fs.writeFile(this.path, JSON.stringify(carts));
  }

  async getCarts() {
    let carts = [];
    try {
      const file = await fs.readFile(this.path);
      carts = JSON.parse(file);
    } catch (error) {
      console.log(error);
    }
    return carts;
  }

  async getCartById(id) {
    let carts = await this.getCarts();
    return carts.find((cart) => cart.id === id);
  }

  async updateCart(id, newCart) {
    let carts = await this.getCarts();
    let cartIndex = carts.findIndex((cart) => cart.id === id);
    if (cartIndex !== -1) {
      newCart.id = id;
      carts[cartIndex] = newCart;
      await fs.writeFile(this.path, JSON.stringify(carts));
    }
  }

  async deleteCart(id) {
    let carts = await this.getCarts();
    let filteredCarts = carts.filter((cart) => cart.id !== id);
    if (carts.length !== filteredCarts.length) {
      await fs.writeFile(this.path, JSON.stringify(filteredCarts));
    } else {
      throw new Error(`Carrito con ID ${id} no existe`);
    }
  }
}

module.exports = CartManager;
