const express = require('express');
const router = express.Router();
const { dbGetAction, dbFail, dbSuccess } = require('../../utils/dbHelper');
const Joi = require('joi');
const { token } = require('morgan');
const {hashValue} = require('../../utils/hashHelper');

router.post('/register', async (req, res) => {
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
    console.log('no rows affected');
    res.json('register success', dbResult);
});

router.post('/login', async (req, res) => {
    const
    res.send({ msg: 'login success', token: '' });
});

module.exports = router;
