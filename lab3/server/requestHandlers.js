var db = require('./db');

var headers = {};
headers["Access-Control-Allow-Origin"] = "*";
headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";

function save(response, urlParts){   
    db.addPost(response, urlParts.query['POST'], function(msg){
        headers['Content-Type'] = 'text/html';
        response.writeHead(200, headers);
        response.write(msg);
        response.end();
    });
}

function flag(response, urlParts){
    var id = urlParts.query['ID'];   
    db.postRead(response, id, function(idFound){
        if (idFound){
            headers['Content-Type'] = 'text/html';
            response.writeHead(200, headers);
            response.write("Message " + id + " is now marked as read.");
            response.end();
        }
        else {
            error(response);
        }
    });
}
    
function getAll(response, urlParts){
    headers['Content-Type'] = 'application/json';
    response.writeHead(200, headers);
    db.listPosts(response, function(posts){
        response.write(JSON.stringify(posts));
        response.end();
    });
}

function error(response){
    headers['Content-Type'] = 'text/html';
    response.writeHead(400, headers);
    response.write("400 Bad Request");
    response.end();
}
    


exports.save = save;
exports.flag = flag;
exports.getAll = getAll;
