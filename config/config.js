var path = require('path');

var root = path.join(__dirname, '..');

module.exports = {
  root: root,
  appRoot: path.join(root, 'app'),
  cookieSecret: process.env.COOKIE_SECRET,
  mongo: {
    uri: process.env.MONGO_URI
  },

  HOME_REPO:'just-write-home',
  CALLBACK_URL: process.env.CALLBACK_URL || 'no-callback',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'no-id',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || 'no-secret',
  TEST_AUTH: process.env.TEST_AUTH || 'no-auth'

}