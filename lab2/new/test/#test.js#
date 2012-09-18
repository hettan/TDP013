var should = require('should');
var request = require('superagent');
var assert = require('assert');

var index = require('../lib-coverage/main.js');

var port = 8888;
var endpoint = "http://localhost:" + port;

describe('Server', function() {   
    describe('GET /', function() {
	it('should return 404 Not Found', function(done) {
	    request(endpoint + "/").end(function(res) {
		res.should.have.status(404);
		done();
	    });	    
	});
    });

    describe("GET /flag?ID=hej", function() {
	it('should return 400 Bad Request', function(done) {   
	    request(endpoint + "/flag?ID=hej").end(function(res) {
                res.should.have.status(400);
                done();	
	    });	
	});
    });
    
    describe("Get /save?POST='test post'", function() {
        it('should return test post added to db', function(done) {
            request(endpoint + "/save?POST='test post'").end(function(res) {
                res.text.should.equal("'test post' added to db");
                done();
            });	
	});
    });
    describe("Get /getall", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/getall").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    describe("Get /flag?ID=5057550ad8c1cd1313000001", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/flag?ID=5057550ad8c1cd1313000001").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });
    
});