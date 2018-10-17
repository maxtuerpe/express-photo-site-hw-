const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan')
require('./db/db');
const usersController = require('./controllers/users');
const photosController = require('./controllers/photos')
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('short'));


app.use('/users', usersController);
app.use('/photos', photosController);

app.get('/', (req, res) => {
  res.render('index.ejs');
});


app.listen(3001, () => {
  console.log('listening on port 3000');
})
