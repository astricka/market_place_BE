const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });

const { port } = require('./config');

const app = express();
// routes
const usersRoutes = require('./API/v1/auth');
const listingRoutes = require('./API/v1/listings');

const path = require('path');

// middleware

app.use(morgan('common'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve('public', 'uploads')));

app.get('/', (req, res) => {
    res.send("Hello express");
});

app.post('/api/new-listing', upload.single('mainImage'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (req.file.size >= 5000) {
        res.status(400).json({ error: 'File too big' });
    }
    res.json({msg: 'new-listing', data: req.file.filename});
});

app.use('/api/auth', usersRoutes);
app.use('/api', listingRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
