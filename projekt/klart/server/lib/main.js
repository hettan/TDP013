var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');
var chatServer = require('./chatServer.js');

var handle = {};
handle["/register"] = requestHandlers.register;
handle["/login"] = requestHandlers.login;
handle["/logoff"] = requestHandlers.logoff;
handle["/post"] = requestHandlers.post;
handle["/profile"] = requestHandlers.showProfile;
handle["/add"] = requestHandlers.add;
handle["/friends"] = requestHandlers.friends;
handle["/online"] = requestHandlers.onlineFriends;
handle["/search"] = requestHandlers.search;
handle["/content"] = requestHandlers.getTemplate;

//Allows the chat-server to communicate with the db
chatServer.setInactive(requestHandlers.chatDC);

server.start(router.route, handle, requestHandlers.connectDB, chatServer);