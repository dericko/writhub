var passport = require('passport');


exports.requireLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in!');
    return res.redirect('/login');
  }
  next();
};

exports.github = passport.authenticate('github', {
  scope: 'repo'
});

exports.githubCallback = passport.authenticate('github', {
  failureRedirect: '/',
  scope: 'repo'
});

exports.githubAuthenticated = function (req, res) {
  console.log("Github authenticated!");
  res.redirect('/');
}

exports.checkAuthenticated = function (req, res, callback) {
  if (req.isAuthenticated()) {
    return callback();
  }
  console.log("Failed github auth check");
  res.redirect('/');
}