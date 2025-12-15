const express = require('express');
const app = express();
const serviceProduct = require('../services/serviceProduct');
const jwtService = require("../services/jwtService")

app.use(express.json());

app.get('/products',jwtService.verifyToken, async (req, res) => {
    
    
    try {
        const products = await serviceProduct.getProducts(req, res);
        console.log("products:", products);
        res.render('index.ejs', { products: products });
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Server error" });
            case 404:
                return res.status(404).json({ message: "No products found" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});

app.post('/products',jwtService.verifyToken, async (req, res) => {
    try {
        const result = await serviceProduct.addProduct(req, res);
        switch (result) {
            case 201:
                return res.status(201).json({ message: "Product added successfully" });
            default:
                return res.status(500).json({ message: "Unknown response" });
        }
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Error processing request" });
            case 409:
                return res.status(409).json({ message: "Product already exists" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});

app.delete('/products/:id', jwtService.verifyToken,async (req, res) => {
    try {
        const result = await serviceProduct.deleteProduct(req, res);
        switch (result) {
            case 200:
                return res.status(200).json({ message: "Product deleted successfully" });
            default:
                return res.status(500).json({ message: "Unknown response" });
        }
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Error processing request" });
            case 404:
                return res.status(404).json({ message: "Product not found" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});

app.put('/products/:id',jwtService.verifyToken, async (req, res) => {
    try {
        const result = await serviceProduct.updateProduct(req, res);
        switch (result) {
            case 200:
                return res.status(200).json({ message: "Product updated successfully" });
            default:
                return res.status(500).json({ message: "Unknown response" });
        }
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Error processing request" });
            case 404:
                return res.status(404).json({ message: "Product not found" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});

module.exports = app;