require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors');
const express = require('express');
const ImageKit = require('imagekit');


const adminRoute = require('./src/routes/admin');
const carsRoute = require('./src/routes/cars');
require('express-async-errors')
var session = require('cookie-session')
const { json } = bodyParser



const port = process.env.PORT || 9000
const mongURL = process.env.MONGO


const app = express();
const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_URL,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});



const start = async () => {
    console.log("Starting up........");

    try {
        await mongoose.connect(mongURL);
        console.log("Connected to MongoDb");
    } catch (err) {
        console.error("MongoDB connection Error", err);
    }

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        cookie: { maxAge: 60000, secure: true },
        saveUninitialized: true,

    }))
    app.use(json())
    app.get('/', (req, res) => {
        console.log(req.headers)
        res.send('home ')
    })
    app.get('/auth', function (req, res) {
        var result = imagekit.getAuthenticationParameters();
        res.send(result);
    });
    app.use('/admin', adminRoute)
    app.use('/cars', carsRoute)
    app.use((err, req, res, next) => {
        console.log(err)
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).send('Validation Failed!\n Please Fill in all th fienlds');
            return;
        }
        res.status(500).send(err.message)
    })
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
};

start();

