var express = require('express'),
      auth = require('../controllers/auth');

var router = express.Router();

router.get('/github', auth.github, function () {});

router.get('/github/callback', auth.githubCallback, auth.githubAuthenticated);

module.exports = router;