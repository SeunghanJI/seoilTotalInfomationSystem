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

const getId = session => {
    return knex('account')
        .select('id')
        .where({ session })
        .first();
};

app.get('/list', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(({ id }) => {
            if (!id) {
                return Promise.reject(ERROR_CODE[401]);
            }

            return knex('dept')
                .select('name as deptName');
        })
        .then(deptList => {
            res.status(200).json({ deptList });
        })
        .catch(failed => {
            if (isNaN(failed.code)) {
                return res.status(500).json(ERROR_CODE[500].message);
            }

            res.status(failed.code).json(failed.message);
        });
});

const formatClassTime = (start, end) => {
    const result = [];

    for (let i = start; i <= end; i++) {
        result.push(i);
    };

    return result;
};

const formatClassList = classList => {
    return classList.reduce((classList, { startTime, endTime, day, max, count, ...list }) => {
        if (count >= max) {
            list.isDisable = true;
        }

        list.lectureDate = `${formatClassTime(startTime, endTime).join(',')} / ${day}`;
        list.personnel = `${count} / ${max}`;

        classList.push(list);

        return classList;
    }, []);
};

const getClassList = async (condition) => {
    return await knex('lecture')
        .select(
            'dept.name as deptName',
            'professor.name as professorName',
            'lecture.id as lectureId',
            'lecture.credit',
            'lecture.start_time as startTime',
            'lecture.end_time as endTime',
            'lecture.day',
            'lecture.name as lectureName',
            'lecture.max_personnel as max'
        )
        .count('class_registration.lecture_id as count')
        .innerJoin('dept', 'lecture.dept_id', 'dept.code')
        .innerJoin('professor', 'lecture.prof_id', 'professor.id')
        .leftOuterJoin('class_registration', 'lecture.id', 'class_registration.lecture_id')
        .where(condition)
        .groupBy('lecture.id');
};

app.get('/registration', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);


    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    // const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss'); //현재 날짜
    const currentDate = '2021-03-04 08:00:01'; //테스트용
    const classRegistrationStart = '2021-03-01 08:00:00'; //테스트용
    const classRegistrationEnd = '2021-03-05 23:59:59'; //테스트용

    if (!dayjs(classRegistrationStart).isBefore(currentDate) || !!dayjs(classRegistrationEnd).isBefore(currentDate)) {
        return res.status(409).json('수강신청 날짜가 아닙니다.');
    }

    const query = req.query;
    const year = dayjs(classRegistrationStart).format('YYYY'); //테스트용
    const term = dayjs(classRegistrationStart).format('M'); //테스트용

    getId(session)
        .then(({ id }) => {
            if (!id) {
                return Promise.reject(ERROR_CODE[401]);
            }

            const condition = {
                ...!!utils.checkRequiredProperties(['deptName'], query) && { 'dept.name': query.deptName },
                ...!!utils.checkRequiredProperties(['professorName'], query) && { 'professor.name': query.professorName },
                ...!!utils.checkRequiredProperties(['lectureName'], query) && { 'lecture.name': query.lectureName },
                year,
                term
            };

            return getClassList(condition);

        })
        .then(classList => {
            res.status(200).json({ classList: formatClassList(classList) });
        })
        .catch(failed => {
            if (isNaN(failed.code)) {
                return res.status(500).json(ERROR_CODE[500].message);
            }

            res.status(failed.code).json(failed.message);
        });
});

app.post('/registration', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    // const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss'); //현재 날짜
    const currentDate = '2021-03-04 08:00:01'; //테스트용
    const classRegistrationStart = '2021-03-01 08:00:00'; //테스트용
    const classRegistrationEnd = '2021-03-05 23:59:59'; //테스트용

    if (!dayjs(classRegistrationStart).isBefore(currentDate) || !!dayjs(classRegistrationEnd).isBefore(currentDate)) {
        return res.status(409).json('수강신청 날짜가 아닙니다.');
    }

    const lectureId = req.body.lectureId;
    const year = dayjs(classRegistrationStart).format('YYYY'); //테스트용
    const term = dayjs(classRegistrationStart).format('M'); //테스트용

    getId(session)
        .then(({ id }) => {
            if (!id) {
                return Promise.reject(ERROR_CODE[401]);
            }

            return Promise.all([id,
                knex('lecture')
                    .select('lecture.id', 'lecture.max_personnel as max',)
                    .count('class_registration.lecture_id as count')
                    .leftOuterJoin('class_registration', 'lecture.id', 'class_registration.lecture_id')
                    .where({ 'lecture.id': lectureId })
                    .groupBy('lecture.id')
                    .first(),
                knex('class_registration')
                    .select()
                    .where({
                        'student_id': id,
                        'lecture_id': lectureId
                    })
                    .first()
            ]);
        })
        .then(([id, classInfo, classRegistrationInfo]) => {
            if (!!classRegistrationInfo) {
                return Promise.reject({ code: 400, message: '현재 신청중인 목록입니다.' });
            }

            if (classInfo.count >= classInfo.max) {
                return Promise.reject({ code: 400, message: '수강인원이 초과하였습니다.' });
            }

            return Promise.all([
                knex('class_registration')
                    .insert({
                        student_id: id,
                        lecture_id: classInfo.id
                    }),
                knex('grade')
                    .insert({
                        student_id: id,
                        lecture_id: classInfo.id
                    })
            ]);
        })
        .then(ignore => {
            const condition = {
                year,
                term
            };

            return getClassList(condition);
        })
        .then(classList => {
            res.status(200).json({ classList: formatClassList(classList) });
        })
        .catch(failed => {
            if (isNaN(failed.code)) {
                return res.status(500).json(ERROR_CODE[500].message);
            }

            res.status(failed.code).json(failed.message);
        });
});

module.exports = app;