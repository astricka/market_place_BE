const express = require('express');
const router = express.Router();
const { dbGetAction, dbFail, dbSuccess } = require('../../utils/dbHelper');
const Joi = require('joi');

router.post('/register', (req, res) => {
    const newUser = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
    };

    console.log(newUser);
    res.send('register success');
});

router.post('/login', (req, res) => {
    res.send('login success');
});

module.exports = router;