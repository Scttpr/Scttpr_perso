// Express
const express = require('express');
const app = express();
const port = 3000;

// Middlewares
const path = require('path');
const router = require('./routes/router');
const rootDir = require('./utils/setDir');

// Set dossier statiques
app.use(express.static(path.join(rootDir, 'public')));

// Set template engine
app.set('template engine', 'pug');
app.set('views', 'views');

// Les routes
const router = router;
app.use(router);

// 404
app.use((req, res) => {
    app.status(404).render('404', {pageTitle: 'Not found'});
});

app.listen(port);