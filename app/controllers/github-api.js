var github = require('../../config/github');
var config = require('../../config/config');

/* Find all files */
module.exports.findAllFiles = function (req, res, callback) {
  var user = req.user;
  var authorization = {
    type: 'oauth',
    token: this.accessToken
  };

  github(authorization).repos.getContent({
    user:user.profile.username,
    repo:config.HOME_REPO,
  }, function (err) {
    if (err) {
      return callback(err);
    }
    user.files = user.files || [];
    user.files.push(req.params.repo);
    user.save(function (err) {
      callback(err);
    });
  });
}


/* Find file */
module.exports.findAllFiles = function (req, res, callback) {
  var user = req.user;
  var authorization = {
    type: 'oauth',
    token: this.accessToken
  };

  github(authorization).repos.getContent({
    user:user.profile.username,
    repo:config.HOME_REPO,
    path:req.params.path
  }, function (err) {
    if (err) {
      return callback(err);
    }
    user.files = user.files || [];
    user.files.push(req.params.repo);
    user.save(function (err) {
      callback(err);
    });
  });
}

/* Save file */
module.exports.updateFile = function (req, res, callback) {
  var user = req.user;
  var authorization = {
    type: 'oauth',
    token: this.accessToken
  };

  github(authorization).repos.getContent({
    user:github.user,
    repo:config.HOME_REPO,
    path:req.params.path,
    message:req.params.message,
    content:req.params.content,
    sha:req.params.sha
  }, function (err) {
    if (err) {
      return callback(err);
    }
    user.files = user.files || [];
    user.files.push(req.params.file);
    user.save(function (err) {
      callback(err);
    });
  });
}