var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017);
var db = new mongo.Db('web', server);

var repository = "projekt";
var loginRepo = "login";

function regUser(response, username, password, callback) {

    start(response, function(err, db){
        db.collection(loginRepo, function(err, collection) {
            var newUser = {"username" : username,
                           "password" : password,
                           "active":false,
                           "name": "1",
                           "posts":[],
                           "friends": ["1","2","3","4"]
                          };
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
                    if (user != null && user["password"] == password) {
                        collection.update({"username":username},{$set:{"active":true}});
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
                    collection.update({"username":username},{$set:{"active":false}});
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
                    if(target_prof["friends"].indexOf(src_user) != -1) {
                        var newPost = {"post" : text, "user" : src_user};
                        console.log(text + src_user);
                        collection.update({"username":target_user},
                                          {$push:{"posts": newPost}}, function (err) {
                                              console.log(err);
                                          });
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
                
function getProfile(response, username, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            collection.findOne({"username":username}, function(err, user){
                callback({"name": user["name"], "posts": user["posts"]});
                db.close();
            });
        });
    });
}

function addFriend(response, src_user, target_user, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            collection.update({"username":src_user},
                              {$push:{"friends": target_user}});
            collection.update({"username":target_user},
                              {$push:{"friends": src_user}});
            db.close();
            callback(target_user + " added to your friends!");
        });
    });
}

function getFriends(response, username, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            collection.findOne({"username":username}, function(err, user){
                callback(user["friends"]);
                db.close();
            });
        });
    });
}

function searchUser(response, query, callback){
    start(response, function(err,db){
        db.collection(loginRepo, function(err, collection){
            var regexp = "(?i).*(" + query + ")+.*";
            console.log(query);
            collection.find({"name": {$regex: regexp}}).toArray( function(err, resultProfiles){
                console.log(resultProfiles);
                var result = new Array();
                for (index in resultProfiles) {
                    result[index] = {"user": resultProfiles[index]["username"],
                                     "name": resultProfiles[index]["name"]};
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
exports.getProfile = getProfile;
exports.addFriend = addFriend;
exports.getFriends = getFriends;
exports.searchUser = searchUser;

    
