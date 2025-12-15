const express = require('express');
const app = express();
const serviceUsers = require('../services/serviceUsers');

app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const users = await serviceUsers.getUsers(req, res);
        console.log("users:", users);
        res.render('users.ejs', { users: users });
    } catch (error) {
        switch (error) {
            case 500:
                return res.status(500).json({ message: "Server error" });
            case 404:
                return res.status(404).json({ message: "No users found" });
            default:
                return res.status(500).json({ message: "Unknown error" });
        }
    }
});

app.post('/users', async (req, res) => {
    try {
        const result = await serviceUsers.addUser(req, res);
        switch (result) {
            case 201:
                return res.status(201).json({ message: "User added successfully" });
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
           /* return res.status(200).json({ 
                message: "Login successful", 
                token: result.token,
                redirectUrl: result.redirectUrl
            });*/
             res.cookie('token', result.token, { httpOnly: true });
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

module.exports = app;