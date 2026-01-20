// const pool = require('./db');
const User = require('../models/User');

const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const getUsers = async (req, res) => {
    try {
        
        // const result = await pool.query('SELECT * FROM users');
        // return result.rows;
       
        const users = await User.findAll();
        return users;
    } catch (error) {
        console.error('Database error:', error);
        throw 500;
    }
};
const loginUser = (req, res) => {
    const { username, password } = req.body;
    return new Promise(async (resolve, reject) => {
        try {
          
            // const result = await pool.query(
            //     'SELECT * FROM users WHERE username = $1 AND password = $2',
            //     [username, password]
            // );
            
            // if (result.rows.length > 0) {
            //     const user = result.rows[0];
            //     const payload = { id: user.id, username: user.username };
                
            //     console.log("user", user);
            
           
            const user = await User.findOne({ 
                where: { 
                    username: username, 
                    password: password 
                } 
            });
            
            if (user) {
                const userData = user.get({ plain: true });
                const payload = { id: userData.id, username: userData.username };
                
                console.log("user", userData);
                try {
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
                    const refreshToken = jwt.sign({id: userData.id}, refreshTokenSecret, { expiresIn: '7d' });
                    console.log('token', token);
                    resolve({ 
                        status: 200,
                        token: token,
                        refreshToken: refreshToken,
                        redirectUrl: 'http://localhost:3000/api/products'
                    });
                } catch (error) {
                    reject(500);
                }
            } else {
                reject(401);
            }
        } catch (error) {
            console.error('Database error:', error);
            reject(500);
        }
    });
};
const addUser = (req, res) => {
    const { username, email, password } = req.body;
    
    return new Promise(async (resolve, reject) => {
        try {
          
            // const existingUser = await pool.query(
            //     'SELECT * FROM users WHERE username = $1',
            //     [username]
            // );
            
            // if (existingUser.rows.length > 0) {
            //     reject(409);
            //     return;
            // }
            
            // const result = await pool.query(
            //     'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            //     [username, email, password]
            // );
            
            // if (result.rows.length > 0) {
            //     resolve(201);
            // }
            
            const existingUser = await User.findOne({ where: { username } });
            
            if (existingUser) {
                reject(409);
                return;
            }
            
            const newUser = await User.create({ username, email, password });
            
            if (newUser) {
                resolve(201);
            }
        } catch (error) {
            console.error('Database error:', error);
            reject(500);
        }
    });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    
    return new Promise(async (resolve, reject) => {
        try {
            // const result = await pool.query(
            //     'DELETE FROM users WHERE id = $1',
            //     [id]
            // );
            
            // if (result.rowCount === 0) {
            //     reject(404);
            //     return;
            // }
            
            const deletedCount = await User.destroy({ where: { id } });
            
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

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { username, password } = req.body;
    
    return new Promise(async (resolve, reject) => {
        try {
            // const userCheck = await pool.query(
            //     'SELECT * FROM users WHERE id = $1',
            //     [id]
            // );
            
            // if (userCheck.rows.length === 0) {
            //     reject(404);
            //     return;
            // }
            
            // const user = userCheck.rows[0];
            // const updatedUsername = username || user.username;
            // const updatedPassword = password || user.password;
            
            // const result = await pool.query(
            //     'UPDATE users SET username = $1, password = $2 WHERE id = $3',
            //     [updatedUsername, updatedPassword, id]
            // );
            
            const user = await User.findByPk(id);
            
            if (!user) {
                reject(404);
                return;
            }
            
            const updatedUsername = username || user.username;
            const updatedPassword = password || user.password;
            
            await user.update({ username: updatedUsername, password: updatedPassword });
            
            resolve(200);
        } catch (error) {
            console.error('Database error:', error);
            reject(500);
        }
    });
};

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    loginUser
};