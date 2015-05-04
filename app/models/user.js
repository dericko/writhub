var mongoose = require('mongoose');
var FileSchema = require('./file').schema;
var _ = require('underscore');
var findOrCreate = require('mongoose-findorcreate');
var config = require('../../config/config');
var github = require('../../config/github');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  profile: {
    type: {},
    required: true
  },
  accessToken: {
    type: String,
    required: true,
  },
  homeRepo: {},
  files: [{
    type: mongoose.Schema.ObjectId,
    ref: 'File'
  }]
});

UserSchema.plugin(findOrCreate);

/* Find home repo */
UserSchema.methods.findHomeRepo = function findHomeRepo(callback) {
  var authorization = {
    type: 'oauth',
    token: this.accessToken
  };

  var user = this;

  // Get repo
  github(authorization).repos.getContent({
    user: user.profile.username,
    repo: config.HOME_REPO,
    path: ''
  }, function (err, res) {
    if (err) {
      console.log('MAKE HOME REPO');
      makeNewRepo(callback);
    } else {
      callback(err, res);
    }
  });

/* Make initial repo */
  var makeNewRepo = function (callback) {
    console.log('First login! Creating new repo...')
    github(authorization).repos.create({
      name:config.HOME_REPO,
      description:'A place for your writing',
      auto_init:true
    }, function (err, res) {
      
      if (err) {
        console.log('ERROR MAKING REPO');
        console.log(JSON.stringify(err));
        callback(err);
      }

      console.log(res);
      // user.homeRepo = 
      // user.save(function(err) {
      //       if (err) {
      //          console.log('ERROR SAVING FILE');
      //          callback(err);
      //       }
      //       callback(err, res);
      //     });

      makeNewFile(callback);
    });
  }

/* Make initial dummy file */
  var makeNewFile = function (callback) {
    // Add first file to repo
      console.log('Creating dummy file...');
      var toEncode = new Buffer('Welcome to Just Write! Feel free to delete this file and get to writing :)');
      var encodedDemo = toEncode.toString('base64');

      github(authorization).repos.createFile({
        user: user.profile.username,
        repo: config.HOME_REPO,
        path: 'hello-world.txt',
        message: 'A demo file',
        content: encodedDemo
        }, function(err, res) {
          if (err) {
            console.log('ERROR MAKING FILE');
            console.log(JSON.stringify(err));
            callback(err);
          }

          // Save file to db
          var newFile = new FileSchema({
            sender : user._id,
            name: res.content.name,
            path: res.content.path,
            sha: res.content.sha
          })
          console.log(JSON.stringify(res));

          user.files.push(newFile);
          user.save(function(err) {
            if (err) {
               console.log('ERROR SAVING FILE');
               callback(err);
            }
            callback(err, res);
          });

          console.log('Home repo initialized');
        });
    }
    
}

mongoose.model('User', UserSchema);
