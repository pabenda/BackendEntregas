const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this._idCounter = 0;
  }

  async addProduct(product) {
    product.id = ++this._idCounter;
    let products = await this.getProducts();
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products));
  }

  async getProducts() {
    let products = [];
    try {
      const file = await fs.readFile(this.path);
      products = JSON.parse(file);
    } catch (error) {
      console.log(error);
    }
    return products;
  }

  async getProductById(id) {
    let products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async updateProduct(id, newProduct) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      newProduct.id = id;
      products[productIndex] = newProduct;
      await fs.writeFile(this.path, JSON.stringify(products));
    }
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    let filteredProducts = products.filter((product) => product.id !== id);
    if (products.length !== filteredProducts.length) {
      await fs.writeFile(this.path, JSON.stringify(filteredProducts));
    } else {
      throw new Error(`Producto con ID ${id} no existe`);
    }
  }
}

module.exports = ProductManager;
