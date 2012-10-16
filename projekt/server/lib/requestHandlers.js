var db = require('./db');

//Init headers to allow CORS
var headers = {};
headers["Access-Control-Allow-Origin"] = "*";
headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";

function connectDB(response) {
    db.start(response);
}

function register(response, urlParts){
    var expected = ["user","pw","name"];
    if (checkVars(urlParts, expected)) {
        db.regUser(response, urlParts.query["user"], urlParts.query["pw"], urlParts.query["name"],
                   function(regOK){
                       if (regOK) {
                           sendOK(response, "Congratulations! Your account has been successfully registred.");
                       }
                       else {
                           sendOK(response, "The username is already in use, please try another one!");
                       }
                   });
    }
    else {
        badReq(response);
    }
}

function login(response, urlParts){
    var expected = ["user","pw"];
    if (checkVars(urlParts, expected)) {
        db.userLogin(response, urlParts.query["user"], urlParts.query["pw"], function(msg){
            sendOK(response, msg);
        });
    }
    else {
        badReq(response);
    }
}

function logoff(response, urlParts){
    var expected = ["user"];
    if (checkVars(urlParts, expected)) {
        db.userLogoff(response, urlParts.query["user"], function(msg){
            sendOK(response, msg);
        });
    }
    else {
        badReq(response);
    }
}

function showProfile(response, urlParts){
    var expected = ["user","target"];
    if (checkVars(urlParts, expected)) {
        db.getProfile(response, urlParts.query["user"], urlParts.query["target"],
                      function(posts){
                          sendJson(response, posts);
                      });
    }
    else {
        badReq(response);
    }
}

function post(response, urlParts){
    var expected = ["user","target"];
    if (checkVars(urlParts, expected)) {
        db.addPost(response, urlParts.query['user'], urlParts.query['target'],
                   urlParts.query['text'], function(msg){
                       sendOK(response, msg);
                   });
    }
    else {
        badReq(response);
    }
}

function add(response, urlParts){
    var expected = ["user","target"];
    if (checkVars(urlParts, expected)) {
        db.addFriend(response, urlParts.query["user"], urlParts.query["target"],
                     function(msg){
                         sendOK(response, msg);
                     });
    }
    else {
        badReq(response);
    }
}

function friends(response, urlParts){
    var expected = ["user"];
    if (checkVars(urlParts, expected)) {
        db.getFriends(response, urlParts.query["user"], function(friendList){
            sendJson(response, friendList);
        });
    }
    else {
        badReq(response);
    }
}

function onlineFriends(response, urlParts){
    var expected = ["user"];
    if (checkVars(urlParts, expected)) {
        db.getOnlineFriends(response, urlParts.query["user"], function(friendsOnline){
            sendJson(response, friendsOnline);
        });
    }
    else {
        badReq(response);
    }
}

function search(response, urlParts){
    var expected = ["q"];
    if (checkVars(urlParts, expected)) {
        db.searchUser(response, urlParts.query["q"], function(result){
            sendJson(response, result);
        });
    }
    else {
        badReq(response);
    }
}

var fs = require('fs');

function getTemplate(response, urlParts){
    var expected = ["template"];
    if (checkVars(urlParts, expected)) {
        var templ = urlParts.query["template"];
        fs.readFile('../templates/' + templ + '.html', function(err, html){
            if(err){
                //Requested template not found
                badReq(response);
            }
            else {
                sendOK(response, html.toString());
            }
        });
    }
    else {
        badReq(response);
    }
}

//Used to set the user to inactive for chat-usage
function chatDC(userName){
    db.userDisconnect(userName);
}

//200 OK with msg
function sendOK(response, msg){
    headers['Content-Type'] = 'text/html';
    response.writeHead(200, headers);
    response.write(msg);
    response.end();
}

//200 OK with json
function sendJson(response, json){
    headers['Content-Type'] = 'application/json';
    response.writeHead(200, headers);
    response.write(JSON.stringify(json));
    response.end();
}

//400 Bad Request
function badReq(response){
    headers['Content-Type'] = 'text/html';
    response.writeHead(400, headers);
    response.write("400 Bad Request");
    response.end();
}

//Check so the arguments match the expected variables
function checkVars(urlParts, expected) {
    for(var index in expected) {
        if (urlParts.query[expected[index]] == null) {
            return false;
        }
    }
    return true;
}

exports.connectDB = connectDB;
exports.register = register;
exports.login = login;
exports.logoff = logoff;
exports.post = post;
exports.showProfile = showProfile;
exports.add = add;
exports.friends = friends;
exports.onlineFriends = onlineFriends;
exports.search = search;
exports.getTemplate = getTemplate;
exports.chatDC = chatDC;
