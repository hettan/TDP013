var http = require("http");
var url = require("url");
function start(route, handle, connectDB, chatServer) {
    dbConnected = false;
    connectDB(function(status) {
        if(status) {
            dbConnected = true;
        }
    });

    function onRequest(request, response) {        

        if(dbConnected) {
            var urlParts = url.parse(request.url, true);
	    route(handle, urlParts, response, request);
        }
    }
   
    var server = http.createServer(onRequest).listen(8888);

    //start the chatserver
    chatServer.start(server);
}

exports.start = start;