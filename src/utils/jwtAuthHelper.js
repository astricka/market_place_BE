const { dbFail } = require('../utils/dbHelper');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config');

function authenticateToken(req, res, next) {
    const result = req.get('Authorization');
    console.log('authenticateToken', result);
    if (!result) return dbFail(res, 'not authenticated', 400);
    const token = result.split(' ')[1];
    jwt.verify(token, jwtSecret, (err, data) => {
        if (err) {
            return dbFail(res, 'token expired/invalid', 400);
        }
        // token valid and present
        req.email = data.email;
        next();
    });
}

module.exports = {
    authenticateToken
}
