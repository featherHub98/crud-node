const fs = require('fs');
const filePath = './data/db.json';

const getProducts = async (req, res) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(500);
                return;
            }
            if (!data) {
                reject(404);
                return;
            }
            try {
                const db = JSON.parse(data);
                resolve(db.products || []);
            } catch (error) {
                reject(500);
            }
        });
    });
};

const addProduct = (req, res) => {
    const { name, price } = req.body;
    
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(500);
                return;
            }
            
            let db;
            try {
                db = data ? JSON.parse(data) : { products: [] };
            } catch (error) {
                reject(500);
                return;
            }
        
            if (db.products.some(prod => prod.name === name)) {
                reject(409);
                return;
            }
   
            const newId = db.products.length > 0 
                ? parseInt(db.products[db.products.length - 1].id) + 1 
                : 1;
            
            const newProduct = {
                id: newId,
                name,
                price
            };
            
            db.products.push(newProduct);
            
            fs.writeFile(filePath, JSON.stringify(db, null, 2), (err) => {
                if (err) {
                    reject(500);
                    return;
                }
                resolve(201);
            });
        });
    });
};

const deleteProduct = (req, res) => {
    //const id = parseInt(req.params.id);
    const id = parseInt(req.body.id);
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(500);
                return;
            }
            
            if (!data) {
                reject(404);
                return;
            }
            
            let db;
            try {
                db = JSON.parse(data);
            } catch (error) {
                reject(500);
                return;
            }
            
            const initialLength = db.products.length;
            db.products = db.products.filter(prod => prod.id !== id);
            
            if (db.products.length === initialLength) {
                reject(404);
                return;
            }
            
            fs.writeFile(filePath, JSON.stringify(db, null, 2), (err) => {
                if (err) {
                    reject(500);
                    return;
                }
                resolve(200);
            });
        });
    });
};

const updateProduct = (req, res) => {
    
    const {id, name, price } = req.body;
    
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(500);
                return;
            }
            
            if (!data) {
                reject(404);
                return;
            }
            
            let db;
            try {
                db = JSON.parse(data);
            } catch (error) {
                reject(500);
                return;
            }
            
            const productIndex = db.products.findIndex(prod => prod.id === parseInt(id));
            
            if (productIndex === -1) {
                reject(404);
                return;
            }

            db.products[productIndex] = {
                ...db.products[productIndex],
                name: name || db.products[productIndex].name,
                price: price || db.products[productIndex].price
            };
            
            fs.writeFile(filePath, JSON.stringify(db, null, 2), (err) => {
                if (err) {
                    reject(500);
                    return;
                }
                resolve(200);
            });
        });
    });
};

module.exports = {
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct
};