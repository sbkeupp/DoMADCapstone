const localStrategy = require('passport-local').Strategy;

const resCode = require('./resCode');
const user = require('../models/user');

module.exports = function(passport) {
  // login
  passport.use(new localStrategy( 
    function(username, password, done) {
      let query = {$or: [
        {username: username},
        {email: username}
      ]}
      user.findOne(query, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(resCode.login.wrongUsername, null);
        }
        if (!user.validatePassword(password)) {
          return done(resCode.login.wrongPassword, null);
        }
        return done(null, user);
      });
    }
  ));

  // sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
