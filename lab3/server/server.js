var http = require("http");
var url = require("url");

function start(route, handle) {

    function onRequest(request, response) {
        var urlParts = url.parse(request.url, true);

	route(handle, urlParts, response, request);
    }
    
    http.createServer(onRequest).listen(8888);

}

exports.start = start;