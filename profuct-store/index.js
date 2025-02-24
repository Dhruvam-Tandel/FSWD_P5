const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;



const productsFilePath = path.join(__dirname, 'data', 'products.json');
const getProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
};


app.get('/products', (req, res) => {
    const products = getProducts();
    const category = req.query.category;
    
    if (category) {
        const filteredProducts = products.filter(product => product.category === category);
        res.json(filteredProducts);
    } else {
        res.json(products);
    }
});


app.get('/products/:id', (req, res) => {
    const products = getProducts();
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Product Catalog API running at http://localhost:${PORT}`);
});
