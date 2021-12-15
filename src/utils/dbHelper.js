const mysql = require('mysql2/promise');
const { dbConfig } = require('../config');

const dbGetAction = async (sql, data = []) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [result] = await conn.execute(sql, data);
        await conn.end();
        return result;
    } catch (error) {
        console.log('/dbGetAction error ', error.message);
        return false;
    }
};

const dbFail = (res, errorText, statusCode = 500) => {
    res.status(statusCode).json({ error: errorText });
};

const dbSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({ msg: 'success', data: data });
};

module.exports = {
    dbGetAction,
    dbSuccess,
    dbFail
}
