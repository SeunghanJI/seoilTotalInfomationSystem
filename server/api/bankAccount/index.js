const express = require('express');
const app = express();
const dayjs = require('dayjs');
const utils = require('../../utils');
const { ERROR_CODE } = require('../../errors');

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: 'db/main.db'
    },
    useNullAsDefault: true
});

const formatBankAccountList = (rawList) => {
    return rawList.reduce((bankAccountList, bankAccountInfo) => {
        bankAccountList.push({
            bankAccountId: bankAccountInfo.bankAccountId,
            bankCode: bankAccountInfo.bankCode,
            accountNumber: bankAccountInfo.accountNumber,
            onwerName: bankAccountInfo.onwerName,
            ...!!bankAccountInfo.isMain && { isMain: true }
        })
        return bankAccountList
    }, []);
};

const getBankAccountList = (user) => {
    return knex('bank_account')
        .select('id as bankAccountId', 'bank_code as bankCode', 'number as accountNumber', 'onwer_name as onwerName', 'is_main as isMain')
        .where({ user_id: user.id, is_deleted: 0 })
        .orderBy([{ column: 'is_main', order: 'desc' }, { column: 'created_at' }])
        .then(bankAccountList => {
            return formatBankAccountList(bankAccountList);
        });
};

app.get('/list', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message)
    }

    knex('account')
        .select('id')
        .where({ session })
        .first()
        .then(user => {
            if (!user.id) {
                return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }
            return getBankAccountList(user);
        })
        .then(userBankAccountList => {
            res.status(200).json(userBankAccountList);
        })
        .catch(err => {
            res.status(500).json(ERROR_CODE[500]);
        });
});

app.post('/', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const body = req.body;

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }
    if (!utils.checkRequiredProperties(['bankCode', 'accountNumber', 'onwerName'], body)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }

    knex('account')
        .select('id')
        .where({ session })
        .first()
        .then(user => {
            if (!user.id) {
                return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }
            return Promise.all([user, knex('bank_account')
                .select('user_id')
                .where({ user_id: user.id, is_main: 1 })
                .first()]);
        })
        .then(([user, hasMainAccount]) => {
            const isMainAccount = !!hasMainAccount ? 0 : 1;
            return knex('bank_account')
                .insert({
                    user_id: user.id,
                    bank_code: body.bankCode,
                    number: body.accountNumber,
                    onwer_name: body.onwerName,
                    is_main: isMainAccount,
                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                .then(ignore => {
                    return user;
                })
        })
        .then(user => {
            return getBankAccountList(user);
        })
        .then(userBankAccountList => {
            res.status(200).json(userBankAccountList);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
})

app.patch('/main', (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const bankAccountId = req.body.bankAccountId;

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }
    if (!utils.checkRequiredProperties(['bankAccountId'], req.body)) {
        return res.status(ERROR_CODE[400].code).json(ERROR_CODE[400].message);
    }

    knex('account')
        .select('id')
        .where({ session })
        .first()
        .then(user => {
            if (!user.id) {
                return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }
            return knex('bank_account')
                .update({ is_main: 0 })
                .where({ user_id: user.id, is_main: 1 })
                .then(ignore => {
                    return user;
                });
        })
        .then(user => {
            return knex('bank_account')
                .update({ is_main: 1 })
                .where({ user_id: user.id, id: bankAccountId })
                .then(ignore => {
                    return user;
                });
        })
        .then(user => {
            return getBankAccountList(user);
        })
        .then(userBankAccountList => {
            res.status(200).json(userBankAccountList);
        })
        .catch(err => {
            res.status(500).json(ERROR_CODE[500]);
        });
});

app.delete('/:bankAccountId', async (req, res) => {
    const cookie = req.headers.cookie;
    const session = utils.getSession(cookie);
    const bankAccountId = req.params.bankAccountId;

    if (!cookie && !session) {
        return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
    }

    knex('account')
        .select('id')
        .where({ session })
        .first()
        .then(user => {
            if (!user.id) {
                return res.status(ERROR_CODE[401].code).json(ERROR_CODE[401].message);
            }
            return knex('bank_account')
                .where({ id: bankAccountId })
                .update({
                    is_main: 0,
                    is_deleted: 1
                })
                .then(ignore => {
                    return user;
                });
        })
        .then(user => {
            return getBankAccountList(user);
        })
        .then(userBankAccountList => {
            res.status(200).json(userBankAccountList);
        })
        .catch(err => {
            res.status(500).json(ERROR_CODE[500]);
        });
});


module.exports = app;