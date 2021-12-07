const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const utils = require('../../utils');
const { ERROR_CODE } = require('../../errors');

const db = new sqlite3.Database('db/main.db', (err) => {
    if (err) {
        console.error(err.message);
    };
});

const generateAccount = (accountInfo) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into account(id,password) values(${accountInfo.id},"${accountInfo.password}")`,
            (err) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(true);
            });
    });
};

const checkId = id => {
    if (100000000 < id && id < 999999999)
        return 'student';
    else
        return 'professor';
}

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
                resolve(row.id);
            });
    });
};

const getStudentInfo = (tableName, id) => {
    return new Promise((resolve, reject) => {
        db.get(`select id,${tableName}.name "name",birthday,dept.name "deptName", email, phone_num "phoneNum",is_break "isBreak",is_agree_collection_data "isAgreeCollectionData" 
                from ${tableName}
                inner join dept
                on ${tableName}.department = dept.code
                where id = ${id}`,
            (err, row) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                if (!row) {
                    reject(ERROR_CODE[400])
                }
                row.isBreak = row.isBreak ? true : false;
                row.isAgreeCollectionData = row.isAgreeCollectionData ? true : false;
                resolve(row);
            });
    });
};

const getSimpleUserInfo = (tableName, id) => {
    return new Promise((resolve, reject) => {
        db.get(`select id,${tableName}.name as name,dept.name as deptName from ${tableName}
                inner join dept
                on ${tableName}.department = dept.code
                where id = ${id}`,
            (err, row) => {
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

const getUserAddress = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`select zip_code "zipCode",region,detail_address "detail" from user_address
                where id = ${id}`,
            (err, row) => {
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

const getUserCurrentAddress = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`select zip_code "zipCode",region,detail_address "detailAddress" from user_current_address
                where id = ${id}`,
            (err, row) => {
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

const insertStudent = (studentInfo) => {
    const sql = `insert into student(${Object.keys(studentInfo).join(',')}) values(${Object.values(studentInfo).map(v => isNaN(v) ? `"${v}"` : v)})`;
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

const insertProfessor = (professorInfo) => {
    const sql = `insert into professor(${Object.keys(professorInfo).join(',')}) values(${Object.values(professorInfo).map(v => isNaN(v) ? `"${v}"` : v)})`;
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

const updateUser = (userId, tableName, updateInfo) => {
    updateInfo = {
        ...!!updateInfo.email && { email: updateInfo.email },
        ...!!updateInfo.phoneNum && { phone_num: updateInfo.phoneNum },
        ...updateInfo.isBreak !== undefined && { is_break: updateInfo.isBreak ? 1 : 0 },
        ...updateInfo.isAgreeCollectionData !== undefined && { is_agree_collection_data: updateInfo.isAgreeCollectionData ? 1 : 0 }
    };
    const table = `update ${tableName} set `;
    const update = Object.entries(updateInfo).map(([key, value]) => `${key} = ${isNaN(value) ? `"${value}"` : value}`).join(', ');
    const conditional = ` where id = ${userId}`
    return new Promise((resolve, reject) => {
        db.run(table + update + conditional,
            function (err) {
                if (err) {
                    reject(ERROR_CODE[400]);
                }
                resolve(this.lastID);
            });
    });
};

const updateAddress = (userId, tableName, updateInfo) => {
    updateInfo = {
        ...!!updateInfo.zipCode && { zip_code: updateInfo.zipCode },
        ...!!updateInfo.region && { region: updateInfo.region },
        ...!!updateInfo.detail && { detail_address: updateInfo.detail }
    };
    const table = `update ${tableName} set `;
    const update = Object.entries(updateInfo).map(([key, value]) => `${key} = ${isNaN(value) ? `"${value}"` : value}`).join(', ');
    const conditional = ` where id = ${userId}`
    return new Promise((resolve, reject) => {
        db.run(table + update + conditional,
            function (err) {
                if (err) {
                    reject(ERROR_CODE[400]);
                }
                resolve(this.lastID);
            });
    });
};


app.get('/', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message)
    }

    getId(session)
        .then(user => {
            return Promise.all([getStudentInfo(checkId(user.id), user.id), getUserAddress(user.id), getUserCurrentAddress(user.id)]);
        })
        .then(([base, address, currentAddress]) => {
            res.status(200).json({ base, address, currentAddress });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        })
});

app.get('/simple', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message)
    }

    getId(session)
        .then(user => {
            return getSimpleUserInfo(checkId(user.id), user.id);
        })
        .then(userInfo => {
            res.status(200).json(userInfo);
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        })
});

app.post('/student', (req, res) => {
    const body = req.body;

    if (!utils.checkRequiredProperties(['id', 'name', 'birthday', 'sex', 'department', 'email', 'phone_num', 'address', 'gurdian_id', 'is_break'], body)) {
        res.status(400).json(ERROR_CODE(400).message);
    }

    insertStudent(body)
        .then(rowid => {
            return generateAccount({ id: rowid, password: body.birthday.split('/').join('') });
        })
        .then(ignore => {
            res.status(200).json({ insert: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        })
});

app.post('/professor', (req, res) => {
    const body = req.body;

    if (!utils.checkRequiredProperties(['id', 'name', 'birthday', 'sex', 'department', 'email', 'phone_num', 'address'], body)) {
        res.status(400).json(ERROR_CODE(400).message);
    }

    insertProfessor(body)
        .then(rowid => {
            return generateAccount({ id: rowid, password: body.birthday.split('/').join('') });
        })
        .then(ignore => {
            res.status(200).json({ insert: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        })
});

app.patch('/', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const { base, address, currentAddress } = req.body;

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }
    if (!base && !address && !currentAddress) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }

    getId(session)
        .then((userId) => {
            return Promise.all([!!base && updateUser(userId, checkId(userId), base),
            !!address && updateAddress(userId, 'user_address', address),
            !!currentAddress && updateAddress(userId, 'user_current_address', currentAddress)
            ]);
        })
        .then(ignore => {
            res.status(200).json({ isUpdated: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

module.exports = app;