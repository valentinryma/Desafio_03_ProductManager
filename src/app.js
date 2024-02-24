const express = require('express'); // Importamos la libreria de ExpressJS
const app = express(); // Creamos una instancia de express. 
const ProductManager = require('./ProductManager');

app.get('/', (req, res) => {
    const mensaje = `
        <h1>Desafio 03: ProductManager</h1>
        <h3>Rutas:</3>
        <ul>
            <li><a href="http://localhost:8080/products">Todos los productos</a></li>
            <li><a href="http://localhost:8080/products?limit=5">Primeros 5</a></li>
            <li><a href="http://localhost:8080/products/2">Filtrar producto por ID (2)</a></li>
            <li><a href="http://localhost:8080/products/34123123">Filtrar producto por ID (no existente)</a></li>
        </ul>
        `
    res.send(mensaje);
})

app.get('/products', async (req, res) => {
    const manager = new ProductManager('./products.json');
    const existingProducts = await manager.getProducts();

    // Query Params: Limit
    const limitFilter = req.query.limit;
    if (!limitFilter) {
        res.json(existingProducts);
        return;
    }

    const productByLimit = limitFilter > 0
        ? existingProducts.splice(0, limitFilter)
        : { error: 'limit menor que 0' };

    res.json(productByLimit);
})

app.get('/products/:pid', async (req, res) => {
    const id = +req.params.pid;
    const manager = new ProductManager('./products.json');
    const product = await manager.getProductById(id);

    res.json(product)
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server escuchando en : http://localhost:${PORT}`)
})