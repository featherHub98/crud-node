const express = require('express');
const app = express();
const serviceUsers = require('../services/serviceUsers');
const jwtService = require("../services/jwtService");
const jwt = require('jsonwebtoken');
app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const users = await serviceUsers.getUsers(req, res);
        console.log("users:", users);
        res.render('users.ejs', { users: users });
    } catch (error) {
        console.error('Users route error:', error);
        if (error === 500 || (error && error.code === 'ECONNREFUSED')) {
            return res.status(500).json({ message: "Server error", details: error.message });
        }
        if (error === 404) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(500).json({ message: "Unknown error", details: error.message || error });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const result = await serviceUsers.addUser(req, res);
        switch (result) {
            case 201:
                
                return res.redirect("/api/products")
            default:
                return res.status(500).json({ message: "Unknown response" });
        }
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Error processing request" });
            case 409:
                return res.status(409).json({ message: "User already exists" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});
app.post('/login', async (req, res) => {
    try {
        const result = await serviceUsers.loginUser(req, res);
         const cookieOptions = {
                    httpOnly: true,
                    path: '/'
                    // secure: true, // Uncomment if using HTTPS
                };
             res.cookie('token', result.token, cookieOptions);
             res.cookie('refreshToken', result.refreshToken, cookieOptions);
             return res.redirect(result.redirectUrl);
        }
     catch (error) {
        
        switch (error) {  
            case 500:
                return res.status(500).json({ message: "Error processing request" });
            case 404:
                return res.status(404).json({ message: "No users found" });
            case 401:
                return res.status(401).json({ message: "Invalid credentials" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }});
app.delete('/users/:id', async (req, res) => {
    try {
        const result = await serviceUsers.deleteUser(req, res);
        switch (result) {
            case 200:
                return res.status(200).json({ message: "User deleted successfully" });
            default:
                return res.status(500).json({ message: "Unknown response" });
        }
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Error processing request" });
            case 404:
                return res.status(404).json({ message: "User not found" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const result = await serviceUsers.updateUser(req, res);
        switch (result) {
            case 200:
                return res.status(200).json({ message: "User updated successfully" });
            default:
                return res.status(500).json({ message: "Unknown response" });
        }
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Error processing request" });
            case 404:
                return res.status(404).json({ message: "User not found" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});
app.post('/refresh', jwtService.verifyRefreshToken, async (req, res) => {
    const cookieOptions = {
                    httpOnly: true,
                    path: '/'
                    // secure: true, // Uncomment if using HTTPS
                };
    try {
        const user = req.user.id;
        res.clearCookie('token', { path: '/', httpOnly: true });
        res.clearCookie('refreshToken', { path: '/', httpOnly: true });
        const newToken = jwt.sign({ id: user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ id: user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('token', newToken, cookieOptions);
        res.cookie('refreshToken', newRefreshToken, cookieOptions);
        return res.redirect('/api/products');
    } catch (error) {
        console.error('Token refresh error:', error);
        return res.status(500).json({ message: 'Failed to refresh token' });
    }
})
app.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/', httpOnly: true });
    res.clearCookie('refreshToken', { path: '/', httpOnly: true });
    return res.status(200).redirect('/');
});
module.exports = app;