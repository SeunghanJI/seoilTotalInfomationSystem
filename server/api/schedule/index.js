const express = require('express');
const app = express();
const dayjs = require('dayjs');
const { ERROR_CODE } = require('../../errors');

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: 'db/main.db'
    },
    useNullAsDefault: true
});

app.get('/calendar', (req, res) => {
    const yearMonth = req.query.yearMonth || dayjs().format('YYYYMM');

    knex('schedule')
        .select('contents', 'date')
        .where('date', 'like', `${yearMonth}%`)
        .then(scheduleArr => {
            scheduleArr = scheduleArr.reduce((scheduleObj, schedule) => {
                scheduleObj[schedule.date] = schedule.contents;
                return scheduleObj;
            }, {})
            res.status(200).json(scheduleArr);
        })
        .catch(ignore => {
            res.status(500).json(ERROR_CODE[500].message);
        });
});

module.exports = app;