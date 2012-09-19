var headers = {};
headers["Access-Control-Allow-Origin"] = "*";
headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
headers['Content-Type'] = 'text/html';

function route(handle, urlParts, response, request) {
    var pathname = urlParts.pathname;

    console.log("About to route a request for " + pathname);

    if(request.method == "GET") {
        if(typeof handle[pathname] === 'function') {

	    handle[pathname](response, urlParts);
            
        } else {
	    
	    console.log("No request handler found for " + pathname);
	    response.writeHead(404,headers);
	    response.write("404 Not Found");
	    response.end();
            
        }
    }
    else {
        response.writeHead(405, {'Content-Type' : headers});
	response.write("405 Method Not Allowed");
	response.end();
    }
        
}

exports.route = route;