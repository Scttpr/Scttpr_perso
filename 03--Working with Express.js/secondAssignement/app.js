// Express
const express = require('express');
const app = express();

// Port du serveur
const port = 3000;

// Middlewares
const path = require('path');
const router = require('./routes/router');
const rootDir = require('./utils/path')

// Définition du dossier statique
app.use(express.static(path.join(rootDir, 'public')));

app.use(router);

// Gestion de la 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(port, () => {
    console.log('app lauched on port ' + port);
});

