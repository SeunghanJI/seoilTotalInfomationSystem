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

const RANK_MAP = {
    'A+': 4.5,
    'A': 4.0,
    'B+': 3.5,
    'B': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D+': 1.5,
    'D': 1.0,
    'F': null
};

const rankMaping = (grade) => {
    if (!grade) return null;

    let rank;
    switch (Math.floor(grade / 10)) {
        case 10:
        case 9:
            rank = 'A';
            break;
        case 8:
            rank = 'B';
            break;
        case 7:
            rank = 'C';
            break;
        case 6:
            rank = 'D';
            break;
        default:
            rank = 'F';
            break;
    }

    if (rank !== 'F' && grade % 10 >= 5) {
        rank = rank + '+';
    }
    return rank;
}

const getId = session => {
    return knex('account')
        .select('id')
        .where({ session })
        .first()
        .then(user => {
            if (!user.id) {
                return Promise.reject(ERROR_CODE[401]);
            }
            return user;
        });
};

const lectureTotalInfoMaping = (gradeList) => {
    return gradeList.reduce((lectureTotalInfo, lecture) => {
        lectureTotalInfo[lecture.lecture_id] = {
            personnel: lecture.personnel,
            gradeAvg: lecture.gradeAvg
        }
        return lectureTotalInfo;
    }, {})
};

const formatGradeInfo = (gradeInfo, lectureTotalInfoMap, studentMajor) => {
    gradeInfo = gradeInfo.reduce((gradeInfo, lecture) => {
        lecture.rank = rankMaping(lecture.grade);
        lecture.precedence = `${lecture.precedence}/${lectureTotalInfoMap[lecture.lectureId].personnel}`
        lecture.major = (lecture.deptName === studentMajor.deptName) ? '전공' : '교양';
        gradeInfo.cumulative.credit += !!RANK_MAP[lecture.rank] ? lecture.credit : 0;
        gradeInfo.cumulative.gradeSum += !!RANK_MAP[lecture.rank] ? RANK_MAP[lecture.rank] * lecture.credit : 0;
        gradeInfo.lectureList.push(lecture);
        return gradeInfo;
    }, { cumulative: { credit: 0, gradeSum: 0 }, lectureList: [] });
    gradeInfo.cumulative.gradeAvg = (gradeInfo.cumulative.gradeSum / gradeInfo.cumulative.credit);
    gradeInfo.cumulative.percentage = parseFloat(((gradeInfo.cumulative.gradeAvg * 10.11) + 54).toFixed(2));
    delete gradeInfo.cumulative.gradeSum;
    return gradeInfo;
}

app.get('/current', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    // const year = dayjs().format('YYYY'); 실제변수
    // const term = dayjs().format('MM') < '7' ? '1' : '2'; 실제변수
    const year = '2021'; //테스트용
    const term = '2'; //테스트용

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(user => {
            const userLectureList = knex('grade').select('lecture_id').where({ student_id: user.id });

            return Promise.all([knex('grade')
                .select('lecture_id as lectureId', 'grade', 'dept.name as deptName', 'credit', 'lecture.name as lectureName')
                .rank('precedence', 'grade', 'lecture_id')
                .innerJoin('lecture', 'lecture.id', 'grade.lecture_id')
                .innerJoin('dept', 'lecture.dept_id', 'dept.code')
                .where({
                    student_id: user.id,
                    year,
                    term
                })
                .whereNotNull('grade')
                .orderBy('grade', 'desc'),
            knex('grade')
                .select('lecture_id')
                .count('lecture_id', { as: 'personnel' })
                .avg('grade as gradeAvg')
                .leftOuterJoin('lecture', 'lecture.id', 'grade.lecture_id')
                .whereIn('lecture_id', userLectureList)
                .andWhere({
                    year,
                    term
                })
                .groupBy('lecture_id'),
            knex('student')
                .select('dept.name as deptName')
                .innerJoin('dept', 'dept.code', 'student.department')
                .where({ id: user.id })
                .first()
            ]);
        })
        .then(([gradeInfo, lectureTotalInfo, studentMajor]) => {
            if (gradeInfo.length === 0) {
                return res.status(200).json([]);
            }
            const lectureTotalInfoMap = lectureTotalInfoMaping(lectureTotalInfo);
            res.status(200).json(formatGradeInfo(gradeInfo, lectureTotalInfoMap, studentMajor));
        })
        .catch(failed => {
            if (isNaN(failed.code)) {
                return res.status(500).json(failed.message);
            }
            res.status(failed.code).json(failed.message);
        });
});

app.get('/list', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(user => {
            const userLectureList = knex('grade').select('lecture_id').where({ student_id: user.id });

            return Promise.all([
                knex('grade')
                    .select(knex.raw('year || "-" || term as semester'), 'lecture_id as lectureId', 'grade', 'dept.name as deptName', 'credit', 'lecture.name as lectureName')
                    .rank('precedence', 'grade', 'lecture_id')
                    .innerJoin('lecture', 'lecture.id', 'grade.lecture_id')
                    .innerJoin('dept', 'lecture.dept_id', 'dept.code')
                    .where({
                        student_id: user.id,
                    })
                    .whereNotNull('grade')
                    .orderBy(['semester', { column: 'grade', order: 'desc' }]),
                knex('grade')
                    .select('lecture_id')
                    .count('lecture_id', { as: 'personnel' })
                    .avg('grade as gradeAvg')
                    .leftOuterJoin('lecture', 'lecture.id', 'grade.lecture_id')
                    .whereIn('lecture_id', userLectureList)
                    .groupBy('lecture_id'),
                knex('student')
                    .select('dept.name as deptName')
                    .innerJoin('dept', 'dept.code', 'student.department')
                    .where({ id: user.id })
                    .first()
            ]);
        })
        .then(([gradeInfo, lectureTotalInfo, studentMajor]) => {
            if (gradeInfo.length === 0) {
                return res.status(200).json([]);
            }

            const lectureTotalInfoMap = lectureTotalInfoMaping(lectureTotalInfo);
            const semesterMap = gradeInfo.reduce((semesterMap, lecture) => {
                if (!semesterMap[lecture.semester]) semesterMap[lecture.semester] = { credit: 0, gradeSum: 0, lectureList: [] };
                const lectureInfo = {
                    lectureId: lecture.lectureId,
                    grade: lecture.grade,
                    deptName: lecture.deptName,
                    credit: lecture.credit,
                    lectureName: lecture.lectureName,
                    precedence: `${lecture.precedence}/${lectureTotalInfoMap[lecture.lectureId].personnel}`,
                    rank: rankMaping(lecture.grade),
                    major: (lecture.deptName === studentMajor.deptName) ? '전공' : '교양'
                }
                semesterMap[lecture.semester].credit += !!RANK_MAP[lectureInfo.rank] ? lectureInfo.credit : 0;
                semesterMap[lecture.semester].gradeSum += !!RANK_MAP[lectureInfo.rank] ? RANK_MAP[lectureInfo.rank] * lectureInfo.credit : 0;
                semesterMap[lecture.semester].lectureList.push(lectureInfo);
                return semesterMap;
            }, {});

            gradeInfo = Object.keys(semesterMap).reduce((gradeInfo, term) => {
                const semester = {
                    term,
                    gradeAvg: parseFloat((semesterMap[term].gradeSum / semesterMap[term].credit).toFixed(2)),
                    lectureList: semesterMap[term].lectureList,
                    percentage: parseFloat((((semesterMap[term].gradeSum / semesterMap[term].credit) * 10.11) + 54).toFixed(2))
                }
                gradeInfo.semester.push(semester);
                gradeInfo.cumulative.credit += semesterMap[term].credit;
                gradeInfo.cumulative.gradeAvg += semester.gradeAvg;
                gradeInfo.cumulative.percentage += semester.percentage;
                return gradeInfo;
            }, { cumulative: { credit: 0, gradeAvg: 0, percentage: 0 }, semester: [] });
            gradeInfo.cumulative.gradeAvg = parseFloat((gradeInfo.cumulative.gradeAvg / (Object.keys(gradeInfo.semester).length)).toFixed(2));
            gradeInfo.cumulative.percentage = parseFloat((gradeInfo.cumulative.percentage / (Object.keys(gradeInfo.semester).length)).toFixed(2));
            res.status(200).json(gradeInfo);
        })
        .catch(failed => {
            if (isNaN(failed.code)) {
                return res.status(500).json(failed.message);
            }
            res.status(failed.code).json(failed.message);
        });
});

app.post('/', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const body = req.body;

    if (!cookie || !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }
    if (!utils.checkRequiredProperties(['lectureId', 'studentId', 'studentName'], body)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }

    getId(session)
        .then(async (user) => {
            if (!(user.id >= 10000000 && user.id <= 99999999)) {
                return Promise.reject(ERROR_CODE[401]);
            }
            const whereQuery = await knex('student')
                .select('student.id as student_id', 'lecture.id as lecture_id')
                .innerJoin('grade', 'student.id', 'grade.student_id')
                .innerJoin('lecture', 'grade.lecture_id', 'lecture.id')
                .innerJoin('professor', 'lecture.prof_id', 'professor.id')
                .andWhere('student.id', body.studentId)
                .andWhere('student.name', body.studentName)
                .andWhere('lecture.id', body.lectureId)
                .andWhere('professor.id', user.id)
                .first();
            return knex('grade')
                .update({ grade: body.grade })
                .where(whereQuery);
        })
        .then(ignore => {
            res.status(200).json({ isUpdated: true });
        })
        .catch(failed => {
            if (isNaN(failed.code)) {
                return res.status(500).json(ERROR_CODE[500].message);
            }
            res.status(failed.code).json(failed.message);
        });
});

module.exports = app;