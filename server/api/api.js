const express = require('express');
const app = express();

const apiAuth = require('./auth/index');
app.use('/auth', apiAuth);

const apiUser = require('./user/index');
app.use('/user', apiUser);

module.exports = app;