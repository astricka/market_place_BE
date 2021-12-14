const express = require('express');
const router = express.Router();
const { dbGetAction, dbSuccess, dbFail } = require('../../utils/dbHelper');
const {authenticateToken} = require('../../utils/jwtAuthHelper');
const joi = require('joi');

router.get('/listings', async (req, res) => {
    const sql = 'SELECT * FROM listings';
    const dbResult = await dbGetAction(sql);
    if (dbResult === false) {
        return dbFail(res, 'something went wrong');
    }
    dbSuccess(res, dbResult);
});

router.get('/listings', authenticateToken,  async(req , res ) => {
    const sql = `SELECT * FROM listings INNER JOIN users ON users.id = listings.userId
            WHERE users.email = ?`;
    const dbResult = await dbGetAction(sql, [req.email]);
    if (dbResult === false) return dbFail(res);
    dbSuccess(res, dbResult);
});

router.post('/listings', authenticateToken, async (req, res) => {
    const newListing = {
        title: req.body.title,
        body: req.body.body,
        price: req.body.price,
        image: req.body.image,
    }
    const schema = joi.object({
        title: joi.string().min(10).max(250).required(),
        body: joi.string().min(10).max(250).required(),
        price: joi.number().min(10).required(),
        image: joi.string().min(10).max(255).required(),
    });
    let formValid = false;
    try {
        await schema.validateAsync(newListing, { abortEarly: false });
        formValid = true;
    }
    catch (error) {
        console.warn(error);
        res.status(400).send({
            error: error.details.map((e) => ({
                errorMsg: e.message,
                field: e.context.key,
            })),
        });
        return false;
    }
    if (!formValid) return;

    const sql = `INSERT INTO listings (title, body, price, image) VALUES (?, ?, ?)`;
    const dbResult = await dbGetAction(sql, [newListing]);
    if (dbResult === false) {
        return dbFail(res, 'something went wrong');
    }
    dbSuccess(res, dbResult);
});

module.exports = router;
