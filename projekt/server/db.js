var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017);
var db = new mongo.Db('web', server);

var repository = "projekt";
var loginRepo = "login";


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

function regUser(response, username, password, callback) {
    db.collection(loginRepo, function(err, collection) {
        var newUser = {"username" : username,
                       "password" : password,
                       "active":false,
                       "name": "disp",
                       "posts":[],
                       "friends": []
                      };
        collection.insert(newUser, function(err, result){
            callback("Congratulations! Your account has been successfully registred.");
        });
    });
}

function userLogin(response, username, password, callback){
    db.collection(loginRepo, function(err, collection){
        try {
            collection.findOne({"username":username}, function(err, user){
                if (user != null && user["password"] == password) {
                    collection.update({"username":username},{$set:{"active":true}});
                    callback("1");
                }
                else {
                    callback("0");
                }
            });
        }
        catch(err) {
            callback("3");
        }
    });
}

function userLogoff(response, username, callback) {
    db.collection(loginRepo, function(err, collection){
        try {
            collection.findOne({"username":username}, function(err, user){
                collection.update({"username":username},{$set:{"active":false}});
                callback("You logged off!");
            });
        }
        catch(err) {
            callback("Database error!");
            
        }
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

function getProfile(response, username, callback){
    db.collection(loginRepo, function(err, collection){
        collection.findOne({"username":username}, function(err, user){
            callback({"name": user["name"], "username":user["username"], "posts": user["posts"]});
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
    db.collection(loginRepo, function(err, collection){
        collection.findOne({"username":username}, function(err, user){
            callback(user["friends"]);
        });
    });
}

function getOnlineFriends(response, username, callback){
    var onlineFriends = new Array();
    db.collection(loginRepo, function(err, collection){
        collection.findOne({"username":username}, function(err, user){
            console.log(user["friends"]);
            for (index in user["friends"]) {
                console.log("find friend " + user["friends"][index]);
                collection.findOne({"username": user["friends"][index]}, function(err, friend) {
                    console.log("friend:" + friend);
                    if (friend["active"]) {
                        onlineFriends.push({"name": friend["name"], "user": friend["username"]});
                    }
                    if (user["friends"].length == index + 1) {
                        console.log("onlineFriends" + onlineFriends[0]["user"]);
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
            for (index in resultProfiles) {
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

