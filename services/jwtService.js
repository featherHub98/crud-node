// services/jwtService.js
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    // 1. Check cookies first
    const token = req.cookies?.token; // Use optional chaining and correct plural 'cookies'
    
    // 2. If not in cookies, check Authorization header
    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next(); // Call next() to proceed to the route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = {
    verifyToken
};