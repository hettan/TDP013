var db = require('./db');

function save(response, urlParts){   
    db.addPost(response, urlParts.query['POST'], function(msg){
        response.writeHead(200,  {'Content-Type':'text/html'});
        response.write(msg);
        response.end();
    });
}

function flag(response, urlParts){
    var id = urlParts.query['ID'];   
    db.postRead(response, id, function(idFound){
        if (idFound){
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write("Message " + id + " is now marked as read.");
            response.end();
        }
        else {
            error(response);
        }
    });
}
    
function getAll(response, urlParts){
    response.writeHead(200, {'Content-Type':'application/json'});
    db.listPosts(response, function(posts){
        response.write(JSON.stringify(posts));
        response.end();
    });
}

function error(response){
    response.writeHead(400, {'Content-Type':'text/html'});
    response.write("400 Bad Request");
    response.end();
}
    


exports.save = save;
exports.flag = flag;
exports.getAll = getAll;
