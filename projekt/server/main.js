var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle["/register"] = requestHandlers.register;
handle["/login"] = requestHandlers.login;
handle["/logoff"] = requestHandlers.logoff;
handle["/post"] = requestHandlers.post;
handle["/profile"] = requestHandlers.showProfile;
handle["/add"] = requestHandlers.add;
handle["/friends"] = requestHandlers.friends;
handle["/search"] = requestHandlers.search;
handle["/content"] = requestHandlers.getTemplate;

server.start(router.route, handle);