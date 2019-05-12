// Import Yarn
const express = require('express');

// Import local
const controller = require('./controller');

// Router
const router = express.Router();

// router.get('/', controller.getMessages);
router.post('/', controller.postMessage);

module.exports = router;