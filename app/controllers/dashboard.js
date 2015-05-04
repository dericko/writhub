exports.index = function(req, res) {
  return res.render('dashboard');
};

exports.getHomeRepo = function getHomeRepo(req, res, callback) {
  req.user.findHomeRepo(function (err, files) {

    console.log(files);
    
    if (err) {
      console.log('No repo found');
      return callback(err);
    }

    // Expose to frontend
    res.locals.username = req.user.profile.username;
    res.locals.filesInHome = files;

    callback();
  })
}