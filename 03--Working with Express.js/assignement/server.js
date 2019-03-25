const express = require('express');
const app = express();

const port = 3000;

app.use((req, res, next) => {
    console.log('First middleware');
    next();
});

app.use((req, res, next) => {
    console.log('Second Middleware');
    next();
});

app.use('/users', (req, res, next) => {
    res.send('<h1>Hello</h1>');
});

app.use('/', (req, res, next) => {
    res.send('Bienvenue à la racine');
});

app.listen(port);

