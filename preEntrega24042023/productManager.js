const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this._idCounter = 0;
  }

  addProduct(product) {
    product.id = ++this._idCounter;
    let products = this.getProducts();
    products.push(product);
    fs.writeFileSync(this.path, JSON.stringify(products));
  }

  getProducts() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]");
    }
    let products = fs.readFileSync(this.path);
    return JSON.parse(products);
  }

  getProductById(id) {
    let products = this.getProducts();
    return products.find((product) => product.id === id);
  }

  updateProduct(id, newProduct) {
    let products = this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      newProduct.id = id;
      products[productIndex] = newProduct;
      fs.writeFileSync(this.path, JSON.stringify(products));
    }
  }

  deleteProduct(id) {
    let products = this.getProducts();
    let filteredProducts = products.filter((product) => product.id !== id);
    if (products.length !== filteredProducts.length) {
      fs.writeFileSync(this.path, JSON.stringify(filteredProducts));
    } else {
      throw new Error(`Product with id ${id} does not exist`);
    }
  }
}

// Crear una instancia de ProductManager
const productManager = new ProductManager("./products.json");

// Llamar a getProducts recién creada la instancia, debe devolver un arreglo vacío []
console.log(productManager.getProducts());

// Agregar un producto y corroborar que se agregó satisfactoriamente
productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
console.log(productManager.getProducts());

// Obtener un producto por id y corroborar que existe
console.log(productManager.getProductById(1));

// Intentar obtener un producto que no existe y arrojar un error
try {
  console.log(productManager.getProductById(999));
} catch (error) {
  console.log(error.message);
}

// Actualizar un producto y corroborar que se actualizó correctamente
productManager.updateProduct(1, {
  title: "Camisa de vestir",
  description: "Camisa de vestir para hombre",
  price: 60,
  thumbnail: "ruta/de/imagen/nueva",
  code: "CAM001",
  stock: 80,
});
console.log(productManager.getProducts());

// Eliminar un producto y corroborar que se eliminó correctamente
productManager.deleteProduct(1);
console.log(productManager.getProducts());

// Intentar eliminar un producto que no existe y arrojar un error
try {
  productManager.deleteProduct(999);
} catch (error) {
  console.log(error.message);
}