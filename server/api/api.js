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

const apiSchedule = require('./schedule/index');
app.use('/schedule', apiSchedule);

const apiBankAccount = require('./bankAccount/index');
app.use('/bank-account', apiBankAccount);

module.exports = app;