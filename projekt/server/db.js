var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017);
var db = new mongo.Db('web', server);

var repository = "projekt";
var loginRepo = "login";

function regUser(response, username, password, callback) {

    start(response, function(err, db){
        db.collection(loginRepo, function(err, collection) {
            var newUser = {"username" : username,
                           "data": {
                               "password" : password,
                               "active":false,
                               "name": "1",
                               "posts":[{}],
                               "friends": ["1","2","3","4"]
                           }};
            collection.insert(newUser, function(err, result){
                callback("Congratulations! Your account has been successfully registred.");
                db.close();
            });
        });
    });
}

function userLogin(response, username, password, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            try {
                collection.findOne({"username":username}, function(err, user){
                    if (user != null && user["data"]["password"] == password) {
                        collection.update({"username":username},{$push:{"data":{"active":true}}});
                        callback("You logged in!");
                        db.close();
                    }
                    else {
                        callback("Wrong username or password");
                        db.close();
                    }
                });
            }
            catch(err) {
                callback("Database error!");
                db.close();
            }
        });
    });
}

function userLogoff(response, username, callback) {
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            try {
                collection.findOne({"username":username}, function(err, user){
                    collection.update({"username":username},{$push:{"data":{"active":false}}});
                    callback("You logged off!");
                    db.close();
                });
            }
            catch(err) {
                callback("Database error!");
                db.close();
            }
        });
    });
}
                    
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

function addPost(response, src_user, target_user, text, callback){
    start(response, function(err, db){
        db.collection(loginRepo, function(err, collection) {
            collection.findOne({"username":target_user}, function(err, target_prof){
                if(target_prof != null) {   
                    if(target_prof["data"]["friends"].indexOf(src_user) != -1) {
                        var newPost = {"post" : text, "user" : src_user};
                        collection.update({"username":target_user},
                                          {$set:{"data":{"posts":newPost}}});
                        callback("Post sent to " + target_user + "'s profile!");
                        db.close();
                    }
                    else {
                        callback("Cant post on " +target_user + "'s profile yet. You need to be friends first!");
                        db.close();
                    }
                }
                else {
                    callback(target_user + " is not a registred user!");
                    db.close();
                }
            });
        });
    });
}
                
function listPosts(response, username, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            collection.findOne({"username":username}, function(err, user){
                callback(user["data"]["posts"]);
                db.close();
            });
        });
    });
}

function addFriend(response, src_user, target_user, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            collection.update({"username":src_user},
                              {$push:{"data": {"friends": target_user}}});
            collection.update({"username":target_user},
                              {$push:{"data": {"friends": src_user}}});

        });
    });
}

function getFriends(response, username, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            collection.findOne({"username":username}, function(err, user){
                callback(user["data"]["friends"]);
                db.close();
            });
        });
    });
}

function searchUser(response, query, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            var regexp = "(?i).*(" + query + ")+.*";
            //collection.find({"data": {"name": {$regex: /.+/}}}).toArray( function(err, resultProfiles){
            collection.find({"data.name": {$regex: regexp}}).toArray( function(err, resultProfiles){
                console.log(resultProfiles);
                var result = new Array();
                for (index in resultProfiles) {
                    result[index] = {"user": resultProfiles[index]["username"],
                                     "name": resultProfiles[index]["data"]["name"]};
                }
                console.log(result);
                callback(result);
                db.close();
            });
        });
    });
}
    

exports.regUser = regUser;
exports.userLogin = userLogin;
exports.userLogoff = userLogoff;
exports.addPost = addPost;
exports.listPosts = listPosts;
exports.addFriend = addFriend;
exports.getFriends = getFriends;
exports.searchUser = searchUser;

    
