const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const dayJs = require('dayjs');
const app = express();
const utils = require('../../utils');
const { ERROR_CODE } = require('../../errors');

const db = new sqlite3.Database('db/main.db', (err) => {
    if (err) {
        console.error(err.message);
    };
});

const thisTerm = () => {
    const year = dayJs().format('YYYY');
    const term = dayJs().format('MM') <= "06" ? '1' : '2';
    return { year, term };
};

const getId = session => {
    return new Promise((resolve, reject) => {
        db.get(`select id from account
                where session = "${session}"`,
            [], (err, row) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                if (!row) {
                    reject(ERROR_CODE[400])
                }
                resolve(row);
            });
    });
};

const getLecturesWithTerm = (year, term) => {
    return new Promise((resolve, reject) => {
        db.all(`select lecture.id as lectureId,lecture.name as lectureName ,professor.name as professorName, term, dept.name as deptName , max_personnel as maxPersonnel
                from lecture
                inner join professor
                on lecture.prof_id = professor.id
                inner join dept
                on lecture.dept_id = dept.code
                where year = "${year}"
                and term = "${term}"`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(rows);
            });
    });
};

const getStudentLectures = (userId, year, term) => {
    return new Promise((resolve, reject) => {
        db.all(`select lectureId, lectureName, professorName, deptName, year, term, maxPersonnel from grade
                inner join 
                (select lecture.id as lectureId,lecture.name as lectureName ,professor.name as professorName, year, term, dept.name as deptName , max_personnel as maxPersonnel
                from lecture
                inner join professor
                on lecture.prof_id = professor.id
                inner join dept
                on lecture.dept_id = dept.code) as lecture
                on grade.lecture_id = lecture.lectureId
                where student_id = ${userId}
                and year = "${year}"
                and term = "${term}"`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(rows);
            });
    });
};

const insertLecture = (lectureInfo) => {
    const sql = `insert into lecture(${Object.keys(lectureInfo).join(',')}) values(${Object.values(lectureInfo).map(v => isNaN(v) ? `"${v}"` : v)})`;
    return new Promise((resolve, reject) => {
        db.run(sql,
            function (err) {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(this.lastID);
            });
    });
};

app.get('/', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const query = !!Object.keys(req.query).length ? req.query : thisTerm();
    const year = query.year;
    const term = query.term;

    console.log(req.query);

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getLecturesWithTerm(year, term)
        .then(lectures => {
            res.status(200).json(lectures);
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });

});

app.get('/user', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const query = !!Object.keys(req.query).length ? req.query : thisTerm();
    const year = query.year;
    const term = query.term;
    console.log(year, term)

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(user => {
            return getStudentLectures(user.id, year, term);
        })
        .then(userLectures => {
            res.status(200).json(userLectures);
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.post('/', (req, res) => {
    const body = req.body;

    insertLecture(body)
        .then(_ => {
            res.status(200).json({ isInsert: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
})

module.exports = app;