var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle["/register"] = requestHandlers.register;
handle["/login"] = requestHandlers.login;
handle["/logoff"] = requestHandlers.logoff;
handle["/post"] = requestHandlers.post;
handle["/showposts"] = requestHandlers.showPosts;
handle["/add"] = requestHandlers.add;
handle["/friends"] = requestHandlers.friends;
handle["/search"] = requestHandlers.search;

server.start(router.route, handle);