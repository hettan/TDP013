// websocket and http servers
var webSocketServer = require('websocket').server;

var clients = [ ];
var groups = {};

var userIndex = 0;
var groupCount = 0;

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function createGroup(userIndex) {
    var newGroup = new Array();
    newGroup[0] = userIndex;
    groupCount++;
    groups[groupCount] = newGroup;
    return groupCount;
}

function inGroup(groupID, userIndex) {
    for(var i=0; i < groups[groupID].length; i++) {
        if (groups[groupID][i] == userIndex) {
            return true;
        }
    }
    return false;
}
        
function addToGroup(groupID, user) {
    for(var i=0; i < clients.length; i++) {
        console.log("user = " + user);
        console.log(clients);
        if (clients[i]["user"] == user) {
            if (inGroup(groupID,i)) {
                console.log("in group already");
                return false;
            }
                
            delete groups[clients[i]["group"]];
            groups[groupID].push(i);
            clients[i]["group"] = groupID;
            return true;
        }
    }
    console.log("cant find...");
    return false;
}

function removeFromGroup(groupID, user) {
    console.log("rem callled - for group=" + groupID + "   user="+user);
    for(var i=0; i < clients.length; i++) {
        if (clients[i]["user"] == user) {
            for (var x=0; x < groups[groupID].length; x++) {
                if (groups[groupID][x] == i) {
                    groups[groupID].splice(x,1);
                    clients[i]["group"] = createGroup(i);
                    console.log(groups);
                    return true;
                }
            }
        }
    }
    return false;
}

var onDisconnect = function() {};

function start(server) {
    var wsServer = new webSocketServer({
        httpServer: server
    });

    wsServer.on('request', function(request) {
        console.log('Connection from ' + request.origin);
        
        var connection = request.accept(null, request.origin);
        console.log('Connection accepted.');
        
        var userName;
        var index = clients.push({"user": userName,"conn": connection, "group": -1}) - 1;
        clients[index]["group"] = createGroup(index);
        
        var userSet = false;
        connection.on('message', function(message) {
            var msg = message.utf8Data;
            
            if (!userSet) {
                console.log(msg);
                userName = msg;
                clients[index]["user"] = userName;
                userSet = true;
            }
            else {
                console.log(' Received Message from '
                            + userName + ': ' + msg);

                var obj;
                if (msg.substr(0,5) == "/inv " || msg.substr(0,5) == "/rem ") {
                    var targetUser = msg.substr(5,msg.length -1);
                    console.log(msg);
                    if (targetUser == userName) {
                        obj = {
                            time: (new Date()).getTime(),
                            text: htmlEntities("Cant use that on yourself!"),
                            name: "server"
                        };
                    }
                    else if (msg.substr(0,5) == "/inv " &&
                             addToGroup(clients[index]["group"], targetUser)) {
                        obj = {
                            time: (new Date()).getTime(),
                            text: htmlEntities(targetUser + " has joined the conversation"),
                            name: "server"
                        };
                        
                    }
                    else if (msg.substr(0,5) == "/rem " &&
                             removeFromGroup(clients[index]["group"], targetUser)) {
                        obj = {
                            time: (new Date()).getTime(),
                            text: htmlEntities(targetUser + " has been removed from the conversation"),
                            name: "server"
                        };
                        
                    }
                    else {
                        obj = {
                            time: (new Date()).getTime(),
                            text: htmlEntities(targetUser + " could not be found or is already in the conversation!"),
                            name: "server"
                        };
                    }
                    
                }
                else {
                    
                    obj = {
                        time: (new Date()).getTime(),
                        text: htmlEntities(msg),
                        name: userName
                    };           
                }
                
                // broadcast message to all clients in group
                var group = groups[clients[index]["group"]];
                var json = JSON.stringify(obj);
                for (var i=0; i < group.length; i++) {
                    clients[group[i]]["conn"].sendUTF(json);
                }
            }
        });

        // user disconnected
        connection.on('close', function(connection) {
            if (userName !== false) {
                console.log("User disconnected.");
                // remove user from the list of connected clients
                onDisconnect(clients[index]["user"]);
                delete clients[index];
            }
        });

    });
}

function setInactive(callback) {
    onDisconnect = callback;
}

exports.setInactive = setInactive;
exports.start = start;