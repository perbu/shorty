// Authentication driver

const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const User = require("../controllers/user.controller");

passport.use(
  new Strategy((username, password, done) => {
    console.log("Invoking passport strategy");
    User.findOne({ username: username }, (err, user) => {
      console.log("Got something from mongo");
      if (err) {
        console.error("Passport error", err);
        return done(err);
      }
      if (!user) {
        console.error("Auth failed..");
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        console.log("verify failed.");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
 done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    done(null, user);
  });
});


module.exports = passport;
