var db = require('./db');

var headers = {};
headers["Access-Control-Allow-Origin"] = "*";
headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";

function register(response, urlParts){
    db.regUser(response, urlParts.query["user"], urlParts.query["pw"],
               function(msg){
                   headers['Content-Type'] = 'text/html';
                   response.writeHead(200, headers);
                   response.write(msg);
                   response.end();
               });
}

function login(response, urlParts){
    db.userLogin(response, urlParts.query["user"], urlParts.query["pw"],
                 function(msg){
                     headers['Content-Type'] = 'text/html';
                     response.writeHead(200, headers);
                     response.write(msg);
                     response.end();
                 });              
}

function logoff(response, urlParts){
        db.userLogoff(response, urlParts.query["user"],
                     function(msg){
                         headers['Content-Type'] = 'text/html';
                         response.writeHead(200, headers);
                         response.write(msg);
                         response.end();
                     });              
}

function showProfile(response, urlParts){
    db.getProfile(response, urlParts.query["user"],
                 function(posts){
                     headers['Content-Type'] = 'application/json';
                     response.writeHead(200, headers);
                     response.write(JSON.stringify(posts));
                     response.end();
                 });
}

function post(response, urlParts){   
    db.addPost(response, urlParts.query['user'], urlParts.query['target'],
               urlParts.query['text'], function(msg){
                   headers['Content-Type'] = 'text/html';
                   response.writeHead(200, headers);
                   response.write(msg);
                   response.end();
               });
}

function add(response, urlParts){
    db.addFriend(response, urlParts.query["user"], urlParts.query["target"], function(msg){
        headers['Content-Type'] = 'text/html';
        response.writeHead(200, headers);
        response.write(msg);
        response.end();
    });
}

function friends(response, urlParts){
    db.getFriends(response, urlParts.query["user"], function(friendList){
        headers['Content-Type'] = 'application/json';
        response.writeHead(200, headers);
        response.write(JSON.stringify(friendList));
        response.end();
    });
}

function search(response, urlParts){
    db.searchUser(response, urlParts.query["q"], function(result){
        headers['Content-Type'] = 'application/json';
        response.writeHead(200, headers);
        response.write(JSON.stringify(result));
        response.end();
    });
}
    
function error(response){
    headers['Content-Type'] = 'text/html';
    response.writeHead(400, headers);
    response.write("400 Bad Request");
    response.end();
}

var fs = require('fs');

function getTemplate(response, urlParts){
    var templ = urlParts.query["template"];
    fs.readFile('./' + templ + '.html', function(err, html){
        if(err){
            error(response);
        }
        headers['Content-Type'] = 'text/html';
        response.writeHeader(200, headers);  
        response.write(html.toString());  
        response.end();
    });
}
    


exports.register = register;
exports.login = login;
exports.logoff = logoff;
exports.post = post;
exports.showProfile = showProfile;
exports.add = add;
exports.friends = friends;
exports.search = search;
exports.getTemplate = getTemplate;
