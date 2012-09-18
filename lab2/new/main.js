var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle["/save"] = requestHandlers.save;
handle["/flag"] = requestHandlers.flag;
handle["/getall"] = requestHandlers.getAll;

server.start(router.route, handle);