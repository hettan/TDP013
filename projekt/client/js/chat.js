var connection;

function chatClient(userName) {
    "use strict";
    // for better performance - to avoid searching in DOM
    var content = $('#chat');
    var input = $('#chatInput');
    var status = $('#chatStatus');
    // my color assigned by the server
    var myColor = false;
    var myName = false;
   
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    connection = new WebSocket('ws://127.0.0.1:8888');

    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        connection.send(userName);
        status.text('logged in user: ' + userName);
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Cant connect to chatserver!' } ));
    };

    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            alert(e);
            console.log('This doesn\'t look like a valid JSON: ', message);
            return;
        }
        input.removeAttr('disabled');
        addMessage(json.name, json.text, new Date(json.time));
        
    };


    input.keydown(function(e) {
        //keyCode 13 = Enter
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            connection.send(msg);
            
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');

            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate '
                                                 + 'with the WebSocket server.');
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, dt) {
        content.append('<p><span>' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
    }
}

function addToChat(user) {
    connection.send("/inv " + user);
    $("#online"+user).removeClass("noGroup");
    $("#online"+user).addClass("inGroup");
    $("#online"+user).onclick = "removeFromChat(" + user + ")";
}

function removeFromChat(user) {
    connection.send("/rem " + user);
    $("#online"+user).removeClass("inGroup");
    $("#online"+user).addClass("noGroup")
    $("#online"+user).onclick = "addToChat(" + user + ")";
}