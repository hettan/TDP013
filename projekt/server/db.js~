var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017);
var db = new mongo.Db('tdp013', server);

var repository = "test";

function start(response, callback){    
    db.open(function(err,db){
        if(!err){
            console.log("Connected to DB");
            callback(err,db);
        }
        else {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
            headers['Content-Type'] = 'text/html';
            response.writeHead(500, headers);
            response.write("500 Internal Server Error");
            response.end();
        }
    });
}

var addPost = function(response, postMessage, callback){
    start(response, function(err, db){
        db.collection(repository, function(err, collection) {
            var newPost = {"post" : postMessage, "read" : 0};
            collection.insert(newPost, function(err, result){
                callback(postMessage + " added to db");
                db.close();
            });
        });
    });
}

var postRead = function(response, id, callback){
    start(response, function(err,db){
        db.collection(repository, function(err, collection){
            try {
                var objectId = new mongo.BSONPure.ObjectID.createFromHexString(id);
                collection.findOne({_id:objectId}, function(err, post){
                    if (post != null) {
                        collection.update({_id:objectId},{$set:{read:"1"}});
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                    db.close();
                });
            }
            catch(err) {
                callback(false);
                db.close();
            }
        });
    });
}

var listPosts = function(response, callback){
    start(response, function(err,db){
        db.collection(repository, function(err, collection){
            collection.find().toArray(function(err, docs) {
                console.log(docs);
                callback(docs);
                db.close();
            });
        });
    });
}

exports.addPost = addPost;
exports.postRead = postRead;
exports.listPosts = listPosts;

    
