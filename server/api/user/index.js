const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const nodemailer = require('nodemailer');
const dayjs = require('dayjs');
const utils = require('../../utils');
const { ERROR_CODE } = require('../../errors');
const crypto = require('crypto');

const db = new sqlite3.Database('db/main.db', (err) => {
    if (err) {
        console.error(err.message);
    };
});

const encryptString = (str) => {
    return crypto.createHash('sha256').update(str).digest('base64');
};

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
    else if (1000000 < id && id < 9999999)
        return 'professor';
    else
        return '';
};

const generatePW = () => {
    let password = '';
    const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!*~';
    const stringLength = 8;

    for (let i = 0; i < stringLength; i++) {
        password += character.charAt(Math.floor(Math.random() * character.length));
    }
    return password;
}

const verifyEmail = (email) => {
    const regularEmail = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return regularEmail.test(email);
};

const sendMail = (toEmail, password) => {
    const mailConfig = {
        service: 'Naver',
        host: 'smtp.naver.com',
        port: 587,
        auth: {
            user: 'jsh3581482@naver.com',
            pass: 'kgs185046!'
        }
    };

    const message = {
        from: 'jsh3581482@naver.com',
        to: toEmail,
        subject: '임시 비밀번호 발송',
        html: `<p> 바뀐 임시 비밀번호는 ${password}입니다. </p>`
    };

    const transporter = nodemailer.createTransport(mailConfig)
    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (err, info) => {
            if (err) {
                reject();
            }
            resolve({ isSend: true });
        });
    });
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
                    reject(ERROR_CODE[400]);
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
                    reject(ERROR_CODE[400]);
                }
                resolve(row);
            });
    });
};

const getUserAddress = (tableName, id) => {
    return new Promise((resolve, reject) => {
        db.get(`select zip_code "zipCode",region,detail_address "detail" from ${tableName}
                where id = ${id}`,
            (err, row) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                if (!row) {
                    reject(ERROR_CODE[400]);
                }
                if (!row.detail) {
                    delete (row.detail);
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

const updateUserPassword = (userId, newPassword, password = null) => {
    const currentPassword = !!password ? ` and password = "${password}"` : '';
    return new Promise((resolve, reject) => {
        db.run(`update account set password = "${newPassword}" where id = ${userId}` + currentPassword,
            function (err) {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                if (!this.changes) {
                    reject({ code: 400, message: '비밀번호가 틀렸습니다.' });
                }
                resolve(true);
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
                    reject(ERROR_CODE[500]);
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
    const update = Object.entries(updateInfo).map(([key, value]) => `${key} = ${typeof value === 'string' ? `"${value}"` : value}`).join(', ');
    const conditional = ` where id = ${userId}`
    return new Promise((resolve, reject) => {
        db.run(table + update + conditional,
            function (err) {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                resolve(this.lastID);
            });
    });
};

const checkUser = (tableName, id, birthday) => {
    return new Promise((resolve, reject) => {
        db.get(`select id from ${tableName}
                where id = "${id}"
                and birthday = "${birthday}"`,
            [], (err, row) => {
                if (err) {
                    reject(ERROR_CODE[500]);
                }
                if (!row) {
                    reject(ERROR_CODE[400]);
                }
                resolve({ isValid: true });
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
            return Promise.all([getStudentInfo(checkId(user.id), user.id),
            getUserAddress('user_address', user.id),
            getUserAddress('user_current_address', user.id)]);
        })
        .then(([base, address, currentAddress]) => {
            res.status(200).json({ base, address, currentAddress });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.get('/simple', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
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
        });
});

app.post('/student', (req, res) => {
    const body = req.body;

    if (!utils.checkRequiredProperties(['id', 'name', 'birthday', 'sex', 'department', 'email', 'phone_num', 'address', 'gurdian_id', 'is_break'], body)) {
        res.status(400).json(ERROR_CODE(400).message);
    }

    insertStudent(body)
        .then(rowid => {
            return generateAccount({ id: rowid, password: encryptString(body.birthday.split('/').join('')) });
        })
        .then(ignore => {
            res.status(200).json({ insert: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.post('/professor', (req, res) => {
    const body = req.body;

    if (!utils.checkRequiredProperties(['id', 'name', 'birthday', 'sex', 'department', 'email', 'phone_num', 'address'], body)) {
        res.status(400).json(ERROR_CODE(400).message);
    }

    insertProfessor(body)
        .then(rowid => {
            return generateAccount({ id: rowid, password: encryptString(body.birthday.split('/').join('')) });
        })
        .then(ignore => {
            res.status(200).json({ insert: true });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.patch('/', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const { base, address, currentAddress } = req.body;

    if (!base && !address && !currentAddress) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }
    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then((user) => {
            return Promise.all([user, !!base && updateUser(user.id, checkId(user.id), base),
                !!address && updateAddress(user.id, 'user_address', address),
                !!currentAddress && updateAddress(user.id, 'user_current_address', currentAddress)
            ]);
        })
        .then(([user, ignore]) => {
            return Promise.all([getStudentInfo(checkId(user.id), user.id),
            getUserAddress('user_address', user.id),
            getUserAddress('user_current_address', user.id)]);
        })
        .then(([base, address, currentAddress]) => {
            res.status(200).json({ base, address, currentAddress });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.patch('/password', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const body = req.body;

    if (!utils.checkRequiredProperties(['password', 'newPassword'], body)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }
    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    getId(session)
        .then(user => {
            return updateUserPassword(user.id, encryptString(body.newPassword), encryptString(body.password));
        })
        .then(success => {
            res.status(200).json({ isChanged: success });
        })
        .catch(failed => {
            res.status(failed.code).json(failed.message);
        });
});

app.post('/temp-password', (req, res) => {
    const { id, email } = req.body;
    const birthday = dayjs(req.body.birthday).format('YYYY/MM/DD');
    const tempPassword = generatePW();

    if (!utils.checkRequiredProperties(['id', 'email'], req.body)) {
        return res.status(400).json({ message: ERROR_CODE[400] });
    }
    if (!verifyEmail(email)) {
        return res.status(400).json({ message: '이메일 형식이 잘못 되었습니다.' });
    }

    checkUser(checkId(id), id, birthday)
        .then(ignore => {
            return updateUserPassword(id, encryptString(tempPassword))
        })
        .then(ignore => {
            return sendMail(email, tempPassword);
        })
        .then((successSendMail) => {
            res.status(200).json(successSendMail);
        })
        .catch((failed) => {
            res.status(failed.code).json(failed.message);
        });
});

module.exports = app;