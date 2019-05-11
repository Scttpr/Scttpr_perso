// Import Yarn
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import local
const router = require('./router');

// Création de l'app
const app = express();

// Middlewares
app.use(bodyParser.json()); // application/json
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
        );
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    
    // Routing
    app.use(router);
    
    // Error handler
    app.use((error, req, res, next) => {
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({ message, data })
    }) 
    
    // Server & db
    const dbUrl = 'mongodb+srv://Scttpr:Hawaian01@cluster0-2ycpa.mongodb.net/test?retryWrites=true';
    mongoose.connect(dbUrl)
        .then(result => {
            const server = app.listen(3000);
            console.log('server launched');
            // const io = require('./socket').init(server);
            // io.on('connexion', socket => {
            //     console.log('new user');
            // })
        })
        .catch(err => console.log(err));