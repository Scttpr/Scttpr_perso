// Express
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Set template engine
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
const router = require('./routes/router');

// Router
app.use(router);

// 404
app.use((req, res) => {
    res.status(404).render('404', {pageTitle: 'Not found'});
});

app.listen(3000);