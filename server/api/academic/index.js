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

const breakStatusMap = {
    0: '처리중',
    1: '승인'
};

const formatStatusInfo = breakInfo => {
    return breakInfo.map(info => {
        info.status = breakStatusMap[info.status];

        return info;
    });
};

const getBreakList = async (userId) => {
    const breakList = await knex('student')
        .select('student_break.id as breakId', 'professor.name as supervisorName', 'student_break.status', 'student_break.submit_at as submitAt')
        .innerJoin('professor', 'student.supervisor', 'professor.id')
        .innerJoin('student_break', 'student.id', 'student_break.student_id')
        .where({ 'student.id': userId })
        .orderBy('student_break.submit_at');

    return formatStatusInfo(breakList);
};

const getReinstatementList = async (userId) => {
    const reinstatementList = await knex('student')
        .select('student_reinstatement.id as reinstatementId', 'dept.name as deptName', 'student_reinstatement.status', 'student_reinstatement.submit_at as submitAt')
        .innerJoin('student_reinstatement', 'student.id', 'student_reinstatement.student_id')
        .innerJoin('dept', 'student.department', 'dept.code')
        .where({ 'student.id': userId })
        .orderBy('student_reinstatement.submit_at');

    return formatStatusInfo(reinstatementList);
};

const getId = session => {
    return knex('account')
        .select('id')
        .where({ session })
        .first();
};

app.get('/break', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(user => {
            if (!user.id) {
                return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }

            return getBreakList(user.id);
        })
        .then(breakInfoList => {
            res.status(200).json({ breakInfoList });
        })
        .catch(ignore => {
            console.log(ignore)
            res.status(ERROR_CODE[500].code).json(ERROR_CODE[500].message);
        });
});

app.post('/break', (req, res) => {
    const body = req.body;
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const today = dayjs().format('YYYY/MM/DD HH:mm:ss');
    const insertPromiseAll = [];

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    if (!utils.checkRequiredProperties(['startAt', 'endAt'], body)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }

    getId(session)
        .then(user => {
            if (!user.id) {
                return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }

            insertPromiseAll.push(user.id, knex('student_break')
                .insert({
                    student_id: user.id,
                    submit_at: today,
                    start: body.startAt,
                    end: body.endAt,
                    ...body.isMilitaryService && { is_military_service: 1 }
                })
            );

            if (body.isMilitaryService) {
                insertPromiseAll.push(knex('student_military_service')
                    .insert({
                        student_id: user.id,
                        start: body.startMilitaryAt
                    })
                );
            }

            return Promise.all(insertPromiseAll);
        })
        .then(([userId, ignore]) => {
            return getBreakList(userId);
        })
        .then(breakInfoList => {
            res.status(200).json({ breakInfoList });
        })
        .catch(ignore => {
            res.status(ERROR_CODE[500].code).json(ERROR_CODE[500].message);
        });
});

app.get('/reinstatement', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(user => {
            if (!user.id) {
                res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }

            return getReinstatementList(user.id);
        })
        .then(reinstatementInfoList => {
            res.status(200).json({ reinstatementInfoList });
        })
        .catch(ignore => {
            res.status(ERROR_CODE[500].code).json(ERROR_CODE[500].message);
        });
});

app.post('/reinstatement', (req, res) => {
    const body = req.body;
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    if (!utils.checkRequiredProperties(['returnAt'], body)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }

    getId(session)
        .then(user => {
            if (!user.id) {
                res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }

            return Promise.all([user.id, knex('student_reinstatement')
                .insert({
                    student_id: user.id,
                    return_date: body.returnAt,
                    submit_at: dayjs().format('YYYY/MM/DD HH:mm:ss')
                })
            ]);
        })
        .then(([userId, ignore]) => {
            return getReinstatementList(userId);
        })
        .then(reinstatementInfoList => {
            res.status(200).json({ reinstatementInfoList });
        })
        .catch(ignore => {
            res.status(ERROR_CODE[500].code).json(ERROR_CODE[500].message);
        });
});

module.exports = app;