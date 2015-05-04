var express = require('express');
var auth = require('../controllers/auth');
var dashboard = require('../controllers/dashboard');

var router = express.Router();


router.get('/', auth.checkAuthenticated, dashboard.getHomeRepo, dashboard.index);

module.exports = router;
