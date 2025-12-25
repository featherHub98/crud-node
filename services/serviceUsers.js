const fs = require('fs');
const filePath = './data/db.json';
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const { path } = require('../controller/productController');
const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const getUsers = async (req, res) => {
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
                resolve(db.users || []);
            } catch (error) {
                reject(500);
            }
        });
    });
};
const loginUser = (req, res) => {
    const { username, password } = req.body;
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
           
            const user = db.users.find(user => user.username === username && user.password === password);
            if (user) {
                
                const payload = { id: user.id, username: user.username };
                
                console.log("user",user)
                try {
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
                    const refreshToken = jwt.sign({id: user.id}, refreshTokenSecret, { expiresIn: '7d' });
                    console.log('token',token);
                    resolve({ 
                        status: 200,
                        token: token,
                        refreshToken: refreshToken,
                        redirectUrl: 'http://localhost:3000/api/products'
                    });
                } catch (error) {
                    reject( 500);
                }
            }else {
                reject(401);
            }
        });
    });
};
const addUser = (req, res) => {
    const { username,email, password } = req.body;
    
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(500);
                return;
            }
            
            let db;
            try {
                db = data ? JSON.parse(data) : { users: [] };
            } catch (error) {
                reject(500);
                return;
            }

            if (db.users.some(user => user.username === username)) {
                reject(409);
                return;
            }
            
            const newId = db.users.length > 0 
                ? parseInt(db.users[db.users.length - 1].id) + 1 
                : 1;
            
            const newUser = {
                id: newId,
                username,
                email,
                password
            };
            
            db.users.push(newUser);
            
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

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    
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
            
            const initialLength = db.users.length;
            db.users = db.users.filter(user => user.id !== id);
            
            if (db.users.length === initialLength) {
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

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { username, password } = req.body;
    
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
            
            const userIndex = db.users.findIndex(user => user.id === id);
            
            if (userIndex === -1) {
                reject(404);
                return;
            }

            db.users[userIndex] = {
                ...db.users[userIndex],
                username: username || db.users[userIndex].username,
                password: password || db.users[userIndex].password
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
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    loginUser
};