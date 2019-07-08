/* eslint-disable no-undef */
const supertest = require("supertest");
const target = supertest.agent("http://localhost:2000");

// const assert = require("chai").assert;
const should = require("should");
should();

const Shorty = require("../shorty");
const server = new Shorty(2000);

const Url = require('../models/url.model');

const testObject = { key: 'snaffel', url: 'https://www.snaffel.net/' };
const altUrl = 'https://vaffel.net';
const loginTestUser = { username:'per.buer@gmail.com', password:'123' };

describe("Tests", function() {
  before("Set up a server", function(done) {
    // runs before all tests in this block
    server.startup();
    server.em.on("started", function() {
      done();
      // Delete the test object to make sure it doesn't interfere.
      Url.deleteOne( { key:testObject.key });
    });
  });

  after("Shut down the server", function() {
    // Make sure the test object is gone.
    Url.deleteOne( { key:testObject.key });

    server.em.emit("shutdown", "Requesting shutdown");
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases

  // UNIT test begin

  describe("Basic HTTP connection", () => {
    it("should check if the server is answering HTTP requests to / with 404", (done) => {
      target
        .get("/")
        .end( (err,res) => {
          res.status.should.equal(404);
          done();
        });
    });
  });


  describe("Logging in user", () => {
    it("should check that we can login to the service with username and password", (done) => {
      target
        .post("/login")
        .send( loginTestUser )
        .end( (err,res) => {
          res.status.should.equal(200);
          done();
        });
    });
  });


  describe("Add a URL", () => {
    it("should add a URL to shorty and get a 200 ok back", function(done) {
      target
        .post("/create")
        .send(testObject)
        .end( (err,res) => {
          res.status.should.be.equal(200);
          res.body.key.should.be.equal(testObject.key);
          res.body.url.should.be.equal(testObject.url);
        done();
        });
    });
  });

  describe("Re-Add a existing URL", () => {
    it("should add a URL to shorty and get a 409 conflict", function(done) {
      target
        .post("/create")
        .send(testObject)
        .end( (err,res) => {
          res.status.should.equal(409);
          done();
        });
    });
  });
  describe("Fetch a URL", function() {
    it("should fetch the URL we created above", function(done) {
      target
      .get("/snaffel")
      .end( (err,res) => {
        res.status.should.equal(301);
        res.header.location.should.be.equal(testObject.url);
        done();
      });
    });
  });

  describe("Fetch a non-exiting URL", function() {
    it("should try to fetch URL and fail", function(done) {
      target
      .get("/98oooooooooooo")
      .end( (err, res) => {
        res.status.should.equal(404);
        done();
      });
    });
  });

  describe("Update an URL", function() {
    it("should change the URL to " + altUrl, function(done) {
      target
        .put("/snaffel/update")
        .send({ key: testObject.key, url: altUrl})
        .end( (err, res) => {
          console.log("Body:", res.body);
          res.status.should.be.equal(200);
//        res.body.ok.should.be(1);
//        res.body.nModified.should.be(1);
          done();
        });
    });
  });

  describe("Delete an URL", function() {
    it("should delete the URL from the service", function(done) {
      target
        .delete("/snaffel/delete")
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          done();
        });
    });
  });
});
