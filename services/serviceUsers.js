const fs = require('fs');
const filePath = './data/db.json';

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

const addUser = (req, res) => {
    const { username, password } = req.body;
    
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
            
            // Check if user already exists
            if (db.users.some(user => user.username === username)) {
                reject(409);
                return;
            }
            
            // Generate new ID
            const newId = db.users.length > 0 
                ? parseInt(db.users[db.users.length - 1].id) + 1 
                : 1;
            
            const newUser = {
                id: newId,
                username,
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
    updateUser
};