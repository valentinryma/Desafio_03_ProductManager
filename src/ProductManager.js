const fs = require('fs');
class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                ...product
            };
            products.push(newProduct);
            const fileContents = JSON.stringify(products, null, '\t');
            await fs.promises.writeFile(this.path, fileContents);
            console.log('Product added successfully ✔')
            return newProduct;
        } catch (err) {
            throw new Error(`Error adding the product: ${err.message}`);
        }
    }

    // Obtenemos los productos
    async getProducts() {
        try {
            const fileContents = await fs.promises.readFile(this.path);
            const existingProducts = JSON.parse(fileContents); // Nos devuelve un array de objetos
            return existingProducts;
        } catch (err) {
            return [];
        }
    }

    async getProductById(id) {
        // Obtenemos los productos
        const existingProducts = await this.getProducts();
        const prductFound = existingProducts.find(p => p.id === id);

        if (!prductFound) {
            const mensaje = 'Product not found'
            console.error(mensaje);
            return { error: mensaje };
        }

        return prductFound;
    }

    async updateProductById(id, field, new_value) {
        // Recibe 3 parametros: Id: del Producto a modificar | field: a ser modificado | valor: Nuevo valor del field
        const existingProducts = await this.getProducts();
        const index = existingProducts.findIndex(p => p.id === id);
        const productUpdate = existingProducts[index]
        if (index === -1) {
            console.error('Error: Product not found');
            return;
        }

        if (!(Object.keys(productUpdate).includes(field))) {
            console.error(`Error: Field ${field} does not belong to the object`);
            return;
        }
        productUpdate[field.toString()] = new_value;

        // Escribimos el archivo actualizado
        const fileContents = JSON.stringify(existingProducts, null, '\t');
        await fs.promises.writeFile(this.path, fileContents, (err) => {
            if (err) {
                throw new Error(`Error: ${err}`);
            }
        })

        return productUpdate;
    }

    async deleteProductById(id) {
        // Obtenemos los productos
        const existingProducts = await this.getProducts();
        const index = existingProducts.findIndex(p => p.id === id);
        console.log('Index:', index)
        if (index === -1) {
            console.error('Error: Product not found');
            return;
        }

        // Eliminamos el producto
        existingProducts.splice(index, 1)

        // Escribimos el archivo actualizado
        const fileContents = JSON.stringify(existingProducts, null, '\t');
        await fs.promises.writeFile(this.path, fileContents, (err) => {
            if (err) {
                throw new Error(`Error: ${err}`);
            }
        })
    }
}

module.exports = ProductManager;