const fs = require("fs");
const path = require('path');
const filePath = path.join(__dirname, '../data/db.json');

/*const getProducts = (req,res) =>{
        fs.readFile(filePath,'utf-8',(err,data)=>{
            if (err){
                return res.status(500).json({message : "error reading file"})
            }
            if (!data){
                return res.status(500).json({message : "no products"})
            }
            db = JSON.parse(data).products
           return res.status(200).json({message:"products returned", products: db})
        })
}*/


const getProducts = async (req, res) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject("error reading file");
                return;
            }
            if (!data) {
                reject("no products");
                return;
            }
            
            const db = JSON.parse(data).products;
            let allData = [];
            if (db.length > 0) {
                 allData = db
            }
           
            
            resolve(allData);  
        });
    });
}


const addProduct = (req,res) => {
    const {name,price} = req.body;
        fs.readFile(filePath,'utf-8',(err,data)=>{
            if (err){
                return res.status(500).json({message : "error reading file"})
            }
            if (!data){
                return res.status(500).json({message : "no products"})
            }
            db = JSON.parse(data)
            db.products.forEach(prod => { 
                if (prod.name === name){
                    return res.status(400).json({message:"product already exists"});
                }
            });
            const newProduct = {
                id : parseInt(db.products[db.products.length-1].id) +1,
                name,
                price
            }
            db.products.push(newProduct);
            fs.writeFile(filePath, JSON.stringify(db,null,2),(err)=>{
                if (err){
                    return res.status(500).json({message : "error writing file"})
                }
                return res.status(201).json({message:"product added"})
    
    
        })
    
    })}
const deleteProduct = (req,res) => {
        const id = parseInt(req.params.id);  
        fs.readFile(filePath,'utf-8',(err,data)=>{
                if (err){
                    return res.status(500).json({message : "error reading file"})
                }
                if (!data){//to be updated to use the right status code
                    return res.status(500).json({message : "no products"})
                    
                }
                let newDb ;
                let db ;
                try {
                    db = JSON.parse(data)
                  newDb = db.products.filter(prod => prod.id !== id);    
                   db.products = newDb;
                   console.log(newDb);
                } catch (error) {
                    console.error("Error parsing JSON data:", error);
                    return res.status(500).json({ message: "Error processing file data" });
                }
                 fs.writeFile(filePath, JSON.stringify(db,null,2),(err)=>{
                    if (err){
                        return res.status(500).json({message : "error writing file"})
                    }
                    return res.status(200).json({message:"product deleted"})
        
            })
        });    }
 const updateProduct = (req,res) => {
            
                const id = req.params.id;  
                const {name,price} = req.body;
            fs.readFile(filePath,'utf-8',(err,data)=>{
                    if (err){
                        return res.status(500).json({message : "error reading file"})
                    }
                    if (!data){
                        return res.status(500).json({message : "no products"})
                    }
                    let db ;
                    try {
                        db = JSON.parse(data)
                        db.products.forEach(prod => {
                            if (prod.id == id){
                                prod.name = name;
                                prod.price = price;
                            }
                        });
                    } catch (error) {
                        console.error("Error parsing JSON data:", error);
                        return res.status(500).json({ message: "Error processing file data" });
                    }
                    fs.writeFile(filePath, JSON.stringify(db,null,2),(err)=>{
                        if (err){
                            return res.status(500).json({message : "error writing file"})
                        }
                        return res.status(200).json({message:"product updated"})
            
                })
            });    
        }
module.exports = {
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct
}