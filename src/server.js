const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { port } = require('./config');

const app = express();
// routes
const usersRoutes = require('./API/v1/users');

// middleware

app.use(morgan('common'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello express");
});

app.use('/users', usersRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));