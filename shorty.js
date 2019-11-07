"use strict";

/*
 * Todo:
 * Add users, auth, authz
 * Login with Twitter
 * Make it proper HTTP, use redirects.
 *
 */

// const log = require("why-is-node-running");

const Emitter = require("events").EventEmitter;

class Shorty {
  constructor(port) {
    //app.js
    this.express = require("express");
    this.bodyParser = require("body-parser");
    this.router = require("./routes/routes");
    this.app = this.express();
    this.mongoose = require("mongoose");
    // Silence deprication warning:
    this.mongoose.set('useCreateIndex', true);
    this.em = new Emitter();
    this.port = port;
    this.morgan = require('morgan');

  }

  async startup() {
    try {
      // Set up mongoose connection
      const dev_db_url = "mongodb://localhost/shorty";
      const mongoDB = process.env.MONGODB_URI || dev_db_url;

      this.db = this.mongoose.connect(mongoDB, { useNewUrlParser: true });
      this.mongoose.Promise = global.Promise;
      //      this.db = this.mongoose.connection;
      this.em.emit("dbconnOK", "Database connection established OK");
    } catch (err) {
      console.warn(err);
      process.exit(1);
    }
    try {
      // Set up middleware

      // Load our own auth driver.

      this.auth = require("./config/auth");
  //      console.log(this.auth);

      this.app.use(this.auth.initialize());
      this.app.use(this.auth.session());
    
      // support parsing of application/json type post data
      this.app.use(this.bodyParser.json());

      //support parsing of application/x-www-form-urlencoded post data
      this.app.use(this.bodyParser.urlencoded({ extended: true }));

      // Set up morgan for logging:
      this.app.use(this.morgan('tiny'));

      // Hook up the router.
      this.app.use("/", this.router);
    } catch (err) {
      // failed to listen.
      console.warn("Failed to initialize middleware: ", err);
      this.em.emit("shutdown");
    }

    // Get it up and running.
    
    try {
      this.runningApp = await this.app.listen(this.port);
      console.log("We're up and running");
      this.em.emit("started", "Server is started");

      // Shutdown on event:
      // Fire up listen, keep the return val around (used in shutdown)
      this.em.on("shutdown", () => {
        this.shutdown();
      });

    } catch (err) {
      console.log("Failed to initialize subsystem:", err);
      process.exit(1);
    }
  }

  async shutdown() {
    await this.runningApp.close();
    await this.mongoose.disconnect();

    // If we don't shutdown here, consider calling log() and examine the output.
  }
}

module.exports = Shorty;
