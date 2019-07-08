
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('../controllers/user.controller');

passport.use(new Strategy(
    (username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));
  
module.exports = passport;
