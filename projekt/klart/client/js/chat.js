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
        addMessage(json.name, json.text);  
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

    //If server is not responing
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Server offline');
        }
    }, 3000);

    //Add message to chat
    function addMessage(name, message) {
        content.append('<p><span>' + name + '</span> - ' + message + '</p>');
    }
}

//Add user to groupConversation
function addToChat(user) {
    connection.send("/inv " + user);
    $("#online"+user).removeClass("noGroup");
    $("#online"+user).addClass("inGroup");
    $("#online"+user).onclick = "removeFromChat(" + user + ")";
}

//Remove user from groupConversation
function removeFromChat(user) {
    connection.send("/rem " + user);
    $("#online"+user).removeClass("inGroup");
    $("#online"+user).addClass("noGroup")
    $("#online"+user).onclick = "addToChat(" + user + ")";
}