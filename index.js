const express = require('express');
const mainRouter = require('./main');
const bodyparser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(bodyparser.urlencoded({extended: true}));

app.use(morgan('common', {immidiate: true}));

app.use('/', mainRouter);

app.listen(8080, () => {
   console.log('Server is listening to http://localhost:8080');
});