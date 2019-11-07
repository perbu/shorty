"use strict";

const User = require("../models/user.model");

// Our own auth driver.
const auth = require("../config/auth");

exports.nop = (req, res, next) => {
  console.log("This is the User controller activly doing nothing....");
  return next();
};

exports.login = (req, res, next) => {
    // deconstruct into local vars:
  const { username, password } = req.body;

  console.log(
    "User login controller invoked... for ",
    username, 
    " with password ",
    password
  );
    const cb = (what)=> {console.log("what: ", what)};
    const a = auth.authenticate("local", { failureRedirect: "/login" }, cb );

  console.log( "auth:", a );
//  console.log( "auth:", a() );
  
  return res.send("Hello there");

  console.log("Logging in...", username, " with password ", password);
};
