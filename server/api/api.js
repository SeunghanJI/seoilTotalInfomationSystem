const express = require('express');
const app = express();

const apiAuth = require('./auth/index');
app.use('/auth', apiAuth);

const apiUser = require('./user/index');
app.use('/user', apiUser);

const apiLecture = require('./lecture/index');
app.use('/lecture', apiLecture);

const apiEvaluation = require('./evaluation/index');
app.use('/evaluation', apiEvaluation);

module.exports = app;