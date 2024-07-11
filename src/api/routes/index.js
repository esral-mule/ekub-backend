const express = require('express');

const app = express.Router();

app.use('/docs', express.static('docs'));

app.use('/coverage', express.static('docs'));

app.use('/auth', require('./auth'));

app.use('/admins', require('./admin'));
app.use('/users', require('./user'));

module.exports = app;
