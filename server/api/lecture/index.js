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

const checkId = id => {
    if (100000000 < id && id < 999999999)
        return 'student';
    else
        return 'professor';
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

const getInfoWithId = (tableName, id) => {
    return new Promise((resolve, reject) => {
        db.get(`select * from ${tableName}
                where id = ${id}`,
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

const getLecturesWithTerm = (term) => {
    return new Promise((resolve, reject) => {
        db.all(`select lecture.id as lectureId,lecture.name as lectureName ,professor.name as professorName, term, dept.name as deptName , max_personnel as maxPersonnel
                from lecture
                inner join professor
                on lecture.prof_id = professor.id
                inner join dept
                on lecture.dept_id = dept.code
                where term = "${term}"`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(rows);
            });
    });
};

const getStudentLectures = (userId, term) => {
    return new Promise((resolve, reject) => {
        db.all(`select lectureId, lectureName, professorName, deptName, term, maxPersonnel from grade
                inner join 
                (select lecture.id as lectureId,lecture.name as lectureName ,professor.name as professorName, term, dept.name as deptName , max_personnel as maxPersonnel
                from lecture
                inner join professor
                on lecture.prof_id = professor.id
                inner join dept
                on lecture.dept_id = dept.code) as lecture
                on grade.lecture_id = lecture.lectureId
                where student_id = ${userId}
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
    const query = req.query;
    const year = query.year || thisTerm().year;
    const term = query.term || thisTerm().term;

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getLecturesWithTerm([year, term].join('-'))
        .then(lectures => {
            res.status(200).json(lectures);
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        })

});

app.get('/user', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const query = req.query || thisTerm();
    const year = query.year;
    const term = query.term;

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(user => {
            return getInfoWithId(checkId(user.id), user.id);
        })
        .then(userInfo => {
            return getStudentLectures(userInfo.id, [year, term].join('-'));
        })
        .then(userLectures => {
            res.status(200).json(userLectures);
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        })
});

app.post('/', (req, res) => {
    const body = req.body;

    insertLecture(body)
        .then(_ => {
            res.status(200).json({ isInsert: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        })
})

module.exports = app;