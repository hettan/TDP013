var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017);
var db = new mongo.Db('tdp013', server);

var repository = "test2";

function start(response, callback){    
    db.open(function(err,db){
        if(!err){
            console.log("Connected to DB");
            callback(err,db);
        }
        else {
            response.writeHead(500, {'Content-Type':'text/html'});
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
            
                collection.find({_id:objectId}).toArray(function(err, post){
                    if (post != null && post.length > 0) {
                        collection.update({_id:objectId},{$set:{read:"1"}});
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
            }
            catch(err) {
                callback(false);
            }
            finally {
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

    
