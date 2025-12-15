const express = require('express');
const app = express();
const cors = require('cors');
const productController = require('./controller/productController')
const usersController = require('./controller/usersController');
require('dotenv').config();
const port = 3000;


app.set('view-engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',productController)
app.use('/api', usersController);
 
app.get('/', (req, res) => {
  res.redirect('/api/users');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});