require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DB,
};

const port = process.env.PORT || 7000;
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

module.exports = {
    dbConfig,
    port,
    jwtSecret
};
