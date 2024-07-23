const express = require('express');

const app = express.Router();

app.use('/docs', express.static('docs'));

app.use('/coverage', express.static('docs'));

app.use('/auth', require('./auth'));

app.use('/admins', require('./admin'));
app.use('/users', require('./user'));

app.use('/equb-type', require('./equb-type'));
app.use('/equb-level', require('./equb-level'));

app.use('/uniqueid', require('./uniqueId'));
app.use('/member', require('./member'));
app.use('/membership', require('./membership'));

app.use('/beneficiary', require('./beneficiary'));
app.use('/round', require('./round'));
app.use('/contribution', require('./contribution'));

module.exports = app;
