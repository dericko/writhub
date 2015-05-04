var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var FileSchema = mongoose.Schema({
  sender : {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  path: String,
  content: String,
  sha: String
});

FileSchema.plugin(findOrCreate);

module.exports = {schema : mongoose.model('File', FileSchema)};