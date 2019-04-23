// Express
const express = require('express');
const router = express.Router();

// Middlewares
const path = require('path');
const rootDir = require('../utils/path');

// Routes
router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'));
});

router.get('/users', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'users.html'));
});

// Export du module router
module.exports = router;