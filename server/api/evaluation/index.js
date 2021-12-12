const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const dayjs = require('dayjs');
const app = express();
const utils = require('../../utils');
const { ERROR_CODE } = require('../../errors');

const db = new sqlite3.Database('db/main.db', (err) => {
    if (err) {
        console.error(err.message);
    };
});

const termDate = {
    start: '2021-09-01',
    end: '2021-12-22'
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

const getLecturesInfo = (id, day, week) => {
    return new Promise((resolve, reject) => {
        db.all(`select distinct lecture.id "lectureId", lecture.name "lectureName", professor.name "professorName", day, week, (start_time || '~' || end_time) "time",is_submit "isSubmit" from grade
                inner join lecture
                on grade.lecture_id = lecture.id
                inner join professor
                on lecture.prof_id = professor.id
                inner join evaluation
                on lecture.id = evaluation.lecture_id
                left outer join evaluation_student_answer as answer
                on evaluation.id = answer.evaluation_id
                where grade.student_id = "${id}"
                and day = "${day}"
                and lecture.year = "${dayjs().format('YYYY')}"
                and term = "${dayjs().format('MM') < '06' ? '1' : '2'}"
                and week = ${week}`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(rows);
            });
    });
};

const getCurrentStudentLectures = (studentId, day) => {
    return new Promise((resolve, reject) => {
        db.all(`select lecture.id from grade
                inner join lecture
                on grade.lecture_id = lecture.id
                where student_id = ${studentId}
                and year = ${dayjs().format('YYYY')}
                and term = "${dayjs().format('MM') < '06' ? '1' : '2'}"
                and day = "${day}"`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                rows = rows.map(row => row.id);
                resolve(rows);
            });
    });
};

const getCurrentEvaluations = (day) => {
    return new Promise((resolve, reject) => {
        db.all(`select distinct lecture.id from evaluation
                inner join lecture
                on evaluation.lecture_id = lecture.id
                and year = ${dayjs().format('YYYY')}
                and term = "${dayjs().format('MM') < '06' ? '1' : '2'}"
                and day = "${day}"`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                rows = rows.reduce((rows, row) => {
                    rows[row.id] = true;
                    return rows;
                }, {})
                resolve(rows);
            });
    });
};

const getLectureEvaluations = (lectureId, week) => {
    return new Promise((resolve, reject) => {
        db.all(`select * from evaluation
                where lecture_id = ${lectureId}
                and week = ${week}`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(rows);
            });
    });
};

const getStudentEvaluations = (studentId, lectureId, week) => {
    return new Promise((resolve, reject) => {
        db.all(`select evaluation.id "evaluationId",question.text "question" from evaluation
                inner join evaluation_student_answer as answer
                on evaluation.id = answer.evaluation_id
                inner join evaluation_question as question
                on evaluation.question_id = question.id
                where student_id = ${studentId}
                and lecture_id = ${lectureId}
                and week = ${week}`,
            [], (err, rows) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(rows);
            });
    });
};

const updateAnswer = (userId, evaluationId, text) => {
    return new Promise((resolve, reject) => {
        db.run(`update evaluation_student_answer set text = "${text}", is_submit = 1 where evaluation_id = ${evaluationId} and student_id = ${userId}`,
            function (err) {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(true);
            });
    });
};

const generateEvaluation = (lectureId, week) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`insert into evaluation(lecture_id,question_id,answer_id,week) values(${lectureId},1,1,${week})`);
            db.run(`insert into evaluation(lecture_id,question_id,answer_id,week) values(${lectureId},2,1,${week})`,
                (err) => {
                    if (err) {
                        reject(ERROR_CODE[500]);
                    }
                    resolve(true);
                });
        });
    });
};

const generateStudentAnswer = (userId, evaluationId) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into evaluation_student_answer(evaluation_id,student_id) values(${evaluationId}, ${userId})`,
            (err) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(true);
            });
    });
};

app.get('/', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const query = req.query;
    const week = dayjs().diff(termDate.start, 'week');

    if (!utils.checkRequiredProperties(['lectureId'], query)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }

    getId(session)
        .then(user => {
            return Promise.all([user, getStudentEvaluations(user.id, query.lectureId, week), getLectureEvaluations(query.lectureId, week)]);
        })
        .then(([user, questions, lectureEvaluations]) => {
            if (!!questions.length) {
                return questions;
            }
            return Promise.all(lectureEvaluations.map(evaluation => {
                return generateStudentAnswer(user.id, evaluation.id);
            }))
                .then(ignore => {
                    return getStudentEvaluations(user.id, query.lectureId, week);
                })
        })
        .then(([user, questions]) => {
            res.status(200).json([user, questions]);
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.get('/list', (req, res) => {
    const dayMap = {
        0: '일',
        1: '월',
        2: '화',
        3: '수',
        4: '목',
        5: '금',
        6: '토'
    };
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const week = dayjs().diff(termDate.start, 'week');
    const day = dayMap[dayjs().format('d')]; //실제사용 요일
    const testDay = '월'; //테스트용 요일

    getId(session)
        .then(user => {
            return Promise.all([user, getCurrentStudentLectures(user.id, testDay), getCurrentEvaluations(testDay)]);
        })
        .then(([user, studentLectureIds, lectureIds]) => {
            return Promise.all([user, ...studentLectureIds.map(lectureId => {
                if (!lectureIds[lectureId]) {
                    return generateEvaluation(lectureId, week)
                        .then(ignore => {
                            return true;
                        })
                }
                return true;
            })]);
        })
        .then(([user, ignore]) => {
            return getLecturesInfo(user.id, testDay, week);
        })
        .then(evaluationList => {
            if (evaluationList.length) {
                evaluationList = evaluationList.map(evaluation => {
                    return {
                        lectureId: evaluation.lectureId,
                        lectureName: evaluation.lectureName,
                        professorName: evaluation.professorName,
                        day: evaluation.day,
                        week: evaluation.week,
                        time: evaluation.time,
                        ...!!evaluation.isSubmit && { isSubmit: true }
                    };
                });
            }
            res.status(200).json(evaluationList);
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.post('/answer', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const body = req.body;

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }
    if (!utils.checkRequiredProperties(['answers'], body)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }
    for (let i = 0; i < body.answers.length; i++) {
        if (!body.answers[i].evaluationId || !body.answers[i].text || isNaN(body.answers[i].evaluationId)) {
            return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
        }
    };

    getId(session)
        .then(user => {
            return Promise.all(body.answers.map(answer => {
                return updateAnswer(user.id, answer.evaluationId, answer.text);
            }));
        })
        .then(ignore => {
            res.status(200).json({ isSubmited: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

module.exports = app;