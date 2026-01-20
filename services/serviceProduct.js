// const pool = require('./db');

const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        // const result = await pool.query('SELECT * FROM products');
        // return result.rows;
        
        const products = await Product.findAll();
        return products;
    } catch (error) {
        console.error('Database error:', error);
        throw 500;
    }
};

const addProduct = (req, res) => {
    const { name, price } = req.body;
    
    return new Promise(async (resolve, reject) => {
        try {
            // const existingProduct = await pool.query(
            //     'SELECT * FROM products WHERE name = $1',
            //     [name]
            // );
            // console.log('Query:', 'SELECT * FROM products WHERE name =', name);
            // if (existingProduct.rows.length > 0) {
            //     reject(409);
            //     return;
            // }
            
            // const result = await pool.query(
            //     'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id',
            //     [name, price]
            // );
            
            // if (result.rows.length > 0) {
            //     resolve(201);
            // }
            
            const existingProduct = await Product.findOne({ where: { name } });
            console.log('Query: find product with name =', name);
            if (existingProduct) {
                reject(409);
                return;
            }
            
            const newProduct = await Product.create({ name, price });
            
            if (newProduct) {
                resolve(201);
            }
        } catch (error) {
            console.error('Database error:', error);
            reject(500);
        }
    });
};

const deleteProduct = (req, res) => {
    const id = parseInt(req.body.id);
    return new Promise(async (resolve, reject) => {
        try {
            // const result = await pool.query(
            //     'DELETE FROM products WHERE id = $1',
            //     [id]
            // );
            
            // if (result.rowCount === 0) {
            //     reject(404);
            //     return;
            // }
            
            const deletedCount = await Product.destroy({ where: { id } });
            
            if (deletedCount === 0) {
                reject(404);
                return;
            }
            
            resolve(200);
        } catch (error) {
            console.error('Database error:', error);
            reject(500);
        }
    });
};

const updateProduct = (req, res) => {
    const {id, name, price } = req.body;
    
    return new Promise(async (resolve, reject) => {
        try {
            // const productCheck = await pool.query(
            //     'SELECT * FROM products WHERE id = $1',
            //     [parseInt(id)]
            // );
            
            // if (productCheck.rows.length === 0) {
            //     reject(404);
            //     return;
            // }
            
            // const product = productCheck.rows[0];
            // const updatedName = name || product.name;
            // const updatedPrice = price || product.price;
            
            // const result = await pool.query(
            //     'UPDATE products SET name = $1, price = $2 WHERE id = $3',
            //     [updatedName, updatedPrice, parseInt(id)]
            // );
            
            const product = await Product.findByPk(parseInt(id));
            
            if (!product) {
                reject(404);
                return;
            }
            
            const updatedName = name || product.name;
            const updatedPrice = price || product.price;
            
            await product.update({ name: updatedName, price: updatedPrice });
            
            resolve(200);
        } catch (error) {
            console.error('Database error:', error);
            reject(500);
        }
    });
};

module.exports = {
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct
};