// Le router
const express = require('express');
const router = express.Router();

// Les middlewares
const path = require('path');
const dirRoot = require('../utils/setDir')
const bodyParser = require('body-parser');

// Set template engine
app.set('template engine', 'pug');
app.set('views', 'views');

// Les données
const users = [];

// Les routes
router.get('/', (req, res) => {
    res.render('index', {pageTitle: Accueil});
})

router.post('/add-users', (req, res) => {
    const newUser = req.body.newUser;
    users.push(newUser);
    res.redirect('/users');
});

router.get('/users', (req, res) => {
    res.render('users', {pageTitle: 'Liste utilisateurs', users: users});
});

module.exports = router;