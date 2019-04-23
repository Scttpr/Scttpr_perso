// Express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./utils/path');

const app = express();
const router = require('./routes/router');

app.use(express.static(path.join(rootDir, 'public')));

// Set template engine
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

// Router
app.use(router);

// 404
app.use((req, res) => {
    res.status(404).render('404', {pageTitle: 'Not found'});
});

app.listen(3000);