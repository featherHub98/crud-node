const express = require('express');
const app = express();
const cors = require('cors');
const productController = require('./controller/productController')
const port = 3000;
app.set('view-engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',productController)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});