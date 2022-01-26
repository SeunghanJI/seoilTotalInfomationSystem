const express = require('express');
const app = express();
const utils = require('../../utils');
const { ERROR_CODE } = require('../../errors');
const dayjs = require('dayjs');

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: 'db/main.db'
    },
    useNullAsDefault: true
});

module.exports = app;