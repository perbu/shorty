/* eslint-disable no-undef */
const supertest = require("supertest");
const target = supertest.agent("http://localhost:2000");

// const assert = require("chai").assert;
const should = require("should");
should();

const Shorty = require("../shorty");
const server = new Shorty(2000);

describe("Tests", function() {
  before("Set up a server", function(done) {
    // runs before all tests in this block
    server.startup();
    server.em.on("serverStarted", function() {
      done();
    });
  });

  after("Shut down the server", function() {
    // runs after all tests in this block
    server.em.emit("serverShutdown", "Requesting shutdown");
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases

  // UNIT test begin

  describe("Basic HTTP connection", function() {
    it("should check if the server is answering HTTP requests to / with 404", function(done) {
      target
        .get("/")
        .expect(404)
        .end(function(err, res) {
          res.status.should.equal(404);
          done();
        });
    });
  });

  describe("Add a URL", function() {
    it("should add a URL to shorty and get a 200 ok back", function(done) {
      target
        .post("/create")
        .send({ key: "snaffel", url: "https://www.snaffel.net/" })
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          done();
        });
    });
  });

  describe("Fetch a URL", function() {
    it("should fetch the URL we created above", function(done) {
      target
        .get("/snaffel")
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(302);
          done();
        });
    });
  });

  describe("Update an URL", function() {
    it("should change the URL to vaffel", function(done) {
      target
        .put("/snaffel/update")
        .send({ key: "snaffel", url: "https://vaffel.net/" })
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          done();
        });
    });
  });

  describe("Delete an URL", function() {
    it("should delete the URL from the service", function(done) {
      target
        .delete('/snaffel/delete')
        .expect(200)
        .end(function(err,res) {
          res.status.should.equal(200);
          done();          
        })
    });

  })
});
