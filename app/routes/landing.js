var express = require('express');
var landing = require('../controllers/landing');
var auth = require('../controllers/auth');

var router = express.Router();

router.get('/', landing.index);
router.get('/login', landing.login);
router.get('/logout', landing.logout);

module.exports = router;
