var http = require("http");
var url = require("url");
function start(route, handle, connectDB) {
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
        else {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
            headers['Content-Type'] = 'text/html';
            response.writeHead(500, headers);
            response.write("500 Internal Server Error");
            response.end();
        }
    }
    
    http.createServer(onRequest).listen(8888);

}

exports.start = start;