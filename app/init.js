var logger = require('morgan'),
    path = require('path'),
    config = require('../config/config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    GitHubStrategy = require('passport-github').Strategy;

var db = require('../config/db');
var User = db.model('User');

module.exports = function (app) {

  // View rendering setup
  app.disable('x-powered-by');
  app.set('views', path.join(config.appRoot, 'views'));
  app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(config.appRoot, 'views', 'layouts'),
    partialsDir: path.join(config.appRoot, 'views', 'partials')
  }));
  app.set('view engine', '.hbs');
  app.set('port', process.env.PORT || 3000);

// Cookie setup
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(cookieParser(config.cookieSecret));
  app.use(session({
    secret: config.cookieSecret,
    cookie: {maxAge: 1000 * 60 * 60},
    saveUninitialized: true,
    resave: true
  }));
  app.use(flash());

// Startup passport
  app.use(passport.initialize());
  app.use(passport.session());

// Add github strategy to passport
  passport.use(new GitHubStrategy({
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, callback) {
      User.findOrCreate({
        'profile.id': profile.id
      }, {
        profile: profile,
        accessToken: accessToken,
        refreshToken: refreshToken
      }, function (err, user) {
        if (err) {
          console.log('Error with passport-github');
          callback(err);
        }
        console.log("Saving Github access token: " + accessToken);
        user.profile = profile;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.save(callback);
      });
    }
  ));

// Passport serialization
  passport.serializeUser(function (user, callback) {
    callback(null, user.profile.id);
  });
  passport.deserializeUser(function (id, callback) {
    User.findOne({'profile.id': id}).exec(callback);
  });

// Setup flashes
    app.use(function(req, res, callback) {
      res.locals.successFlashes = req.flash('success');
      res.locals.errorFlashes = req.flash('error');

      if(req.user) {
        res.locals.authUser = req.user;
      }

      callback();
    })

//  app.use(logger('dev'));
  app.use('/static', express.static(config.root + '/public'));

// Add routes
  app.use('/', require('./routes/landing'));
  app.use('/dashboard', require('./routes/dashboard'));
  app.use('/write', require('./routes/write'));
  app.use('/review', require('./routes/review'));
  app.use('/auth', require('./routes/auth'));

// Add error messages
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /*eslint-disable no-unused-vars */
  app.use(function(err, req, res, next) {
    console.error(err);
    err.status = err.status || 500;
    res.status(err.status).render('error', {
      layout: false,
      error: {
        message: err.message,
        status: err.status,
        stack: app.get('env') === 'development' ? err.stack : ''
      }
    });
  });
  /*eslint-enable no-unused-vars */
}