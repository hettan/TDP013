var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017);
var db = new mongo.Db('web', server);

var loginRepo = "projekt";

function start(callback){    
    db.open(function(err,db){
        if(!err){
            console.log("Connected to DB");
            callback(true);
        }
        else {
            callback(false);
        }
    });
}

function regUser(response, username, password, name, callback) {
    db.collection(loginRepo, function(err, collection) {
        collection.findOne({"username":username}, function(err, user){
            if (user == null) {
                var newUser = {"username" : username,
                               "password" : password,
                               "active":false,
                               "name": name,
                               "posts":[],
                               "friends": [username]
                              };
                collection.insert(newUser, function(err, result){
                    callback(true);
                });
            }
            else {
                callback(false);
            }
        });
    });
                         
}

function userLogin(response, username, password, callback){
    db.collection(loginRepo, function(err, collection){
        //try {
            collection.findOne({"username":username}, function(err, user){
                if (user != null && user["password"] == password) {
                    collection.update({"username":username},{$set:{"active":true}});
                    callback("1");
                }
                else {
                    callback("0");
                }
            });
        /* }
                 
        catch(err) {
            callback("3");
        }*/
    });
}

function userLogoff(response, username, callback) {
    db.collection(loginRepo, function(err, collection){
        collection.findOne({"username":username}, function(err, user){
            collection.update({"username":username},{$set:{"active":false}});
            callback("You logged off!");
        });
  
    });
}

function getProfile(response, userprofile, username, callback){
    db.collection(loginRepo, function(err, collection){       
        collection.findOne({"username":username}, function(err, user){
            var friends = false;
            if(userprofile != username) {
                for (var index in user["friends"]) {
                    if(userprofile == user["friends"][index]) {
                        friends = true;
                        break;
                    }
                }
            }
            callback({"name": user["name"], "username":user["username"], "posts": user["posts"], "friends": friends});
        });
    });
}

function addPost(response, src_user, target_user, text, callback){
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
                }
                else {
                    callback("Cant post on " +target_user + "'s profile yet. You need to be friends first!");
                }
            }
            else {
                callback(target_user + " is not a registred user!");
            }
        });
    });
}

function addFriend(response, src_user, target_user, callback){
    db.collection(loginRepo, function(err, collection){
        collection.update({"username":src_user},
                          {$push:{"friends": target_user}});
        collection.update({"username":target_user},
                          {$push:{"friends": src_user}});
        
        callback(target_user + " added to your friends!");
    });
}

function getFriends(response, username, callback){
    var friends = new Array();
    db.collection(loginRepo, function(err, collection){
        collection.findOne({"username":username}, function(err, user){
            for (var index in user["friends"]) {
                collection.findOne({"username": user["friends"][index]}, function(err, friend) {
                    friends.push({"name": friend["name"], "user": friend["username"]});
                    if (user["friends"].length == friends.length) {
                        callback(friends);
                    }
                });
            }
        });
    });
}

function getOnlineFriends(response, username, callback){
    var onlineFriends = new Array();
    db.collection(loginRepo, function(err, collection){
        collection.findOne({"username":username}, function(err, user){
            var count = 0;
            for (var index in user["friends"]) {
                collection.findOne({"username": user["friends"][index]}, function(err, friend) {
                    count++;
                    if (friend["active"]) {
                        onlineFriends.push({"name": friend["name"], "user": friend["username"]});
                    }
       
                    if (user["friends"].length == count) {
                        callback(onlineFriends);
                    }
                });
            }
        });
    });
}

function searchUser(response, query, callback){
    db.collection(loginRepo, function(err, collection){
        var regexp = "(?i).*(" + query + ")+.*";
        console.log(query);
        collection.find({"name": {$regex: regexp}}).toArray( function(err, resultProfiles){
            console.log(resultProfiles);
            var result = new Array();
            for (var index in resultProfiles) {
                result[index] = {"user": resultProfiles[index]["username"],
                                 "name": resultProfiles[index]["name"]};
            }
            console.log(result);
            callback(result);
        });
    });
}


exports.start = start;
exports.regUser = regUser;
exports.userLogin = userLogin;
exports.userLogoff = userLogoff;
exports.addPost = addPost;
exports.getProfile = getProfile;
exports.addFriend = addFriend;
exports.getFriends = getFriends;
exports.getOnlineFriends = getOnlineFriends;
exports.searchUser = searchUser;

