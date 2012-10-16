var connection;

function chatClient(userName) {
    "use strict";

    var content = $('#chat');
    var input = $('#chatInput');
    var status = $('#chatStatus');
    
    var name = false;
   
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // open connection
    connection = new WebSocket('ws://127.0.0.1:8888');

    connection.onopen = function () {
        //Send username to server
        input.removeAttr('disabled');
        connection.send(userName);
        status.text('logged in user: ' + userName);
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Cant connect to chatserver!' } ));
    };

    connection.onmessage = function (message) {
        var json = JSON.parse(message.data);
        
        input.removeAttr('disabled');
        addMessage(json.name, json.text, new Date(json.time));  
    };

    //On "Enter" key
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            connection.send(msg);
            
            $(this).val('');
            //Disable until response
            input.attr('disabled', 'disabled');
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