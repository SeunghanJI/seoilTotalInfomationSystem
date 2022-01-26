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

const apiAcademic = require('./academic/index');
app.use('/academic', apiAcademic);

const apiGrade = require('./grade/index');
app.use('/grade', apiGrade);

const apiClass = require('./class/index');
app.use('/class', apiClass);

module.exports = app;