

function route(handle, urlParts, response, request) {
    var pathname = urlParts.pathname;

    console.log("About to route a request for " + pathname);

    if(request.method == "GET") {
        if(typeof handle[pathname] === 'function') {

	    handle[pathname](response, urlParts);
            
        } else {
	    
	    console.log("No request handler found for " + pathname);
	    response.writeHead(404, {'Content-Type' : 'text/html'});
	    response.write("404 Not Found");
	    response.end();
            
        }
    }
    else {
        response.writeHead(404, {'Content-Type' : 'text/html'});
	response.write("405 Method Not Allowed");
	response.end();
    }
        
}

exports.route = route;