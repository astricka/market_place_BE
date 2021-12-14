const express = require('express');
const router = express.Router();
const { dbGetAction, dbFail, dbSuccess } = require('../../utils/dbHelper');
const { token } = require('morgan');
const {hashValue, verifyHash} = require('../../utils/hashHelper');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../../config');
const {validateRegister, validateLogin} = require('../../utils/validationHelper');

router.post('/register', validateRegister, async (req, res) => {
    const newUser = {
        email: req.body.email,
        password: hashValue(req.body.password),
    };

    const sql = `INSERT INTO users(email, password) VALUES(?, ?)`;
    const dbResult = await dbGetAction(sql, [newUser.email, newUser.password]);
    if (dbResult === false) {
        return res.status(500).json({ error: 'something went wrong' });
    }
    if (dbResult.affectedRows === 1) {
        return res.json({ msg: 'register success', newUser: newUser.email});
    }
    dbSuccess(res, dbResult);
});

router.post('/login', validateLogin, async (req, res) => {
    const sql = 'SELECT * FROM users WHERE email =?';
    const dbResult = await dbGetAction(sql, [req.body.email]);

    if (dbResult.length !== 1) {
        return dbFail(res, 'bad credentials');
    }

    if (!verifyHash(req.body.password, dbResult[0].password)) {
        return dbFail(res, 'bad credentials');
    }

    const token = jwt.sign({ email: req.body.email }, jwtSecret, { expiresIn: '1h' });
    const loggedInUser = {
        email: req.body.email,
        token: token
    }
    // dbSuccess(res, loggedInUser);
    res.send({msg: 'success', loggedInUser})
});

module.exports = router;
