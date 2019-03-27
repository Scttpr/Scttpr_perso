// Le router express
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


// Les données
const users = [];

// Les routes
router.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'Add User' });

  });
  
router.get('/users', (req, res, next) => {
    res.render('users', { pageTitle: 'User', users: users });
});

router.post('/add-users', (req, res, next) => {
    users.push({name: req.body.user });
    console.log(users);

    res.redirect('/users');
});

module.exports = router;
