const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const productController = require('./controller/productController')
const usersController = require('./controller/usersController');
require('dotenv').config();
const port = 3000;


app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: false
}));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
   
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));


app.use('/api', productController);
app.use('/api', usersController);

app.get('/', (req, res) => {
  res.redirect('/api/users');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});