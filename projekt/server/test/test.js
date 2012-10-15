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

    // "/register"
    describe("GET /register?user=1&pw=1&name=1", function() {
	it('should return 200 OK', function(done) {   
	    request(endpoint + "/register?user=1&pw=1&name=1").end(function(res) {
                res.should.have.status(200);
                done();	
	    });	
	});
    });

    describe("GET /register?dontwork=dsdao", function() {
	it('should return 200 OK', function(done) {   
	    request(endpoint + "/register?dontwork=dsdao").end(function(res) {
                res.should.have.status(400);
                done();	
	    });	
	});
    });
    
    describe("GET /register?user=2&pw=2&name=2", function() {
	it('should return 200 OK', function(done) {   
	    request(endpoint + "/register?user=2&pw=2&name=2").end(function(res) {
                res.should.have.status(200);
                done();	
	    });	
	});
    });

    // "/login"
    describe("Get /login?user=dontwork&pw=dontwork", function() {
        it('should return 0', function(done) {
            request(endpoint + "/login?user=dontwork&pw=dontwork").end(function(res) {
                res.text.should.equal("0");
                done();
            });	
	});
    });
    
    describe("Get /login?user=1&pw=1", function() {
        it('should return 1', function(done) {
            request(endpoint + "/login?user=1&pw=1").end(function(res) {
                res.text.should.equal("1");
                done();
            });	
	});
    });

    describe("Get /login?dontwork=dsfdsf", function() {
        it('should return 400', function(done) {
            request(endpoint + "/login?dontwork=dsfdsf").end(function(res) {
                res.should.have.status(400);
                done();
            });	
	});
    });

    // "/post"
    describe("Get /post?user=1&target=2&text=notfriends", function() {
        it("should return 200 OK", function(done) {
            request(endpoint + "/post?user=1&target=2&text=works").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    // "/add"
    describe("Get /add?user=1&target=2", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/profile?user=1&target=2").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    describe("Get /add?dontwork=asdaf", function() {
        it('should return 400', function(done) {
            request(endpoint + "/add?dontwork=asdaf").end(function(res) {
                res.should.have.status(400);
                done();
            });	
	});
    });
    
    // "/profile"
    describe("Get /profile?user=1&target=1", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/profile?user=1&target=2").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    describe("Get /profile?dontwork=asdaf", function() {
        it('should return 400', function(done) {
            request(endpoint + "/profile?dontwork=asdaf").end(function(res) {
                res.should.have.status(400);
                done();
            });	
	});
    });

    // "/post"
    describe("Get /post?user=1&target=2&text=works", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/post?user=1&target=2&text=works").end(function(res) {
                res.text.should.equal("Post sent to 2's profile!");
                done();
            });	
	});
    });

    describe("Get /post?user=1&target=doesntexist&text=nowork", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/post?user=1&target=doesntexist&text=nowork").end(function(res) {
                res.text.should.equal("doesntexist is not a registred user!");
                done();
            });	
	});
    });

    describe("GET /post?ID=hej", function() {
	it('should return 400 Bad Request', function(done) {   
	    request(endpoint + "/post?ID=hej").end(function(res) {
                res.should.have.status(400);
                done();	
	    });	
	});
    });

    // "/friends"
       describe("Get /friends?user=1", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/friends?user=1").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    describe("GET /friends?dontwork=dontwork", function() {
	it('should return 400 Bad Request', function(done) {   
	    request(endpoint + "/friends?dontwork=dontwork").end(function(res) {
                res.should.have.status(400);
                done();	
	    });	
	});
    });

    // "/online"
    describe("Get /online?user=1", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/online?user=1").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    describe("GET /online?dontwork=dontwork", function() {
	it('should return 400 Bad Request', function(done) {   
	    request(endpoint + "/online?dontwork=dontwork").end(function(res) {
                res.should.have.status(400);
                done();	
	    });	
	});
    });

    // "/search"
    describe("Get /search?q=1", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/search?q=1").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    describe("GET /search?dontwork=dontwork", function() {
	it('should return 400 Bad Request', function(done) {   
	    request(endpoint + "/search?dontwork=dontwork").end(function(res) {
                res.should.have.status(400);
                done();	
	    });	
	});
    });

    // "/template"
    describe("Get /content?template=index", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/content?template=index").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });
    
    describe("Get /content?template=doesntexist", function() {
        it('should return 400 Bad Request', function(done) {
            request(endpoint + "/content?template=doesntexist").end(function(res) {
                res.should.have.status(400);
                done();
            });	
	});
    });

    describe("Get /content?doesntwork=doesntwork", function() {
        it('should return 400 Bad Request', function(done) {
            request(endpoint + "/content?doesntwork=doesntwork").end(function(res) {
                res.should.have.status(400);
                done();
            });	
	});
    });

    // "/logoff"
    describe("Get /logoff?user=1", function() {
        it('should return 200 OK', function(done) {
            request(endpoint + "/logoff?user=1").end(function(res) {
                res.should.have.status(200);
                done();
            });	
	});
    });

    describe("Get /logoff?dontwork=dsfdsf", function() {
        it('should return 400', function(done) {
            request(endpoint + "/logoff?dontwork=dsfdsf").end(function(res) {
                res.should.have.status(400);
                done();
            });	
	});
    });

    //Other
    describe('GET /', function() {
	it('should return 404 Not Found', function(done) {
	    request(endpoint + "/").end(function(res) {
		res.should.have.status(404);
		done();
	    });	    
	});
    });

    describe('POST /', function() {
	it('should return 405 Method Not Allowed!', function(done) {
	    request.post(endpoint + "/").end(function(res) {
		res.should.have.status(405);
		done();
	    });	    
	});
    });
    
});