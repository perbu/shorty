"use strict";

/*
* Todo:
* Add users, auth, authz
* Login with Twitter
* Make it proper HTTP, use redirects.
* 
*/


const Emitter = require('events').EventEmitter;

class Shorty {
  constructor(port) {
    //app.js
    this.express = require("express");
    this.bodyParser = require("body-parser");
    this.url = require("./routes/url.route");
    this.app = this.express();
    this.mongoose = require("mongoose");
    this.em = new Emitter();
    this.port = port;
  }

  async startup() {
    try {
      // Set up mongoose connection
      const dev_db_url = "mongodb://localhost/shorty";
      const mongoDB = process.env.MONGODB_URI || dev_db_url;

      this.mongoose.connect(mongoDB, { useNewUrlParser: true });
      this.mongoose.Promise = global.Promise;
      this.db = this.mongoose.connection;
      this.em.emit('dbconnOK','Database connection established OK');
    } catch(err) {
      console.warn(err);
      process.exit(1);
    }
    try { 
      this.app.use(this.bodyParser.json());
      this.app.use(this.bodyParser.urlencoded({ extended: false }));

      this.app.use("/", this.url);
      // Shutdown on event:
      this.em.on('serverShutdown', () => { this.shutdown() });
      // Fire up listen, keep the return val around (used in shutdown)
      this.runningApp = await this.app.listen(this.port);
      console.log("We're up and running");
      this.em.emit('serverStarted','Server is started');

     } catch (err) {
        // failed to listen.
        console.warn("Failed to start express: ", err);
      }
  }
  async shutdown() {
    this.runningApp.close();

    setTimeout(() =>{ 
      console.warn("Failing to exit cleanly.");
      process.exit(1) }, 1000);
    
  }
}


module.exports = Shorty;