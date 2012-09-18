$(document).ready(function() {
   
    alert("tja");
    /*
    var cb = function(err, data) {
        alert("yoyoyo");
        for (post in data) {
            $("<div />", {
     		"class": "msg",
     		text: post["POST"],
     		"id": "msg"+counter,
                "class": "message"
     	    }).prependTo("#divMessages");
        }
    };
        */
    
    $.ajax({
        url: "http://localhost:8888",
        
        success : function(err, data){
            alert(data);
        },
        error : function(req,data,err){
            alert("tja"+err);
        }
    });

    var counter = 0;
    $("#btnPost").click(function() {
     	
     	var statusM = "";
     	var input = $("#txtInput").val();
     	if(input.length == 0) {
     	    statusM = "No message, please write one before posting.";
     	}
     	else if(input.length > 140) {
     	    statusM = "Message to long, only 140 characters is allowed!";
     	}
     	else {
     	    $("<div />", {
     		"class": "msg",
     		text: input,
     		"id": "msg"+counter,
                "class": "message"
     	    }).prependTo("#divMessages");
     	    
     	    $("<div />", {
     		"class": "msgRead",
     		text: "Not read",
     		click: function() {
     		    $(this).html("Read");
     		}
     	    }).appendTo("#msg"+counter);
     	    
     	    counter += 1;	
     	    statusM = "Message succuessfully posted!";
     	}
     	$("#divStatus").html(statusM);
    });
});
