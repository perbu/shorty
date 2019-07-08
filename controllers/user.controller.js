"use strict";

const User = require("../models/user.model");

// Our own auth driver.
const passport = require("../config/auth");

exports.login = (req, res, next) => {
    console.log("User login controller invoked...");
    console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;

  passport.authenticate("local", { failureRedirect: "/" });

  console.log("Logging in...", username, ' with password ', password);

};
