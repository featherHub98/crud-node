const express = require('express');
const app = express();
const serviceProduct = require('../services/serviceProduct');



app.get('/products', (req,res) =>{
    
    serviceProduct.getProducts(req,res);

});

app.post('/products',(req,res)=>{
    serviceProduct.addProduct(req,res);
    });
app.delete('/products/:id',(req,res)=>{
    serviceProduct.deleteProduct(req,res);
});
app.put('/products/:id',(req,res)=>{
    serviceProduct.updateProduct(req,res);
});




module.exports = app;