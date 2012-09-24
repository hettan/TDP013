$(document).ready(function() {
    
    $("#go").click(function() {
     	var user = $("#user").val();
	var pass = $("#pass").val();
	login(user,pass);
    });
    
    $("#register").click(function() {
        var reguser = $("#reguser").val();
        var regpass = $("#regpass").val();
        
        if(reguser.length == 0) {
            alert("Pls enter username");
        }
        else if(regpass.length == 0) {
            alert("Plz enter a password");
        }
        else {
            reg(reguser,regpass)
            $("#Regdrop").modal("hide")
        }
    });

    $(".change").click(function() {
        alert(this.id);
        $.ajax({
            url: "http://localhost:8888/content?template="+this.id,
            success : function(data,err) {
                $("#content").html(data);
                
            }
        });
    });
    
});


function login(user,pass) {
    $.ajax({
        url: "http://localhost:8888/login?user="+user+"&pw="+pass,
        success : function(data,err) {
	    alert(data);
        }
    });
}

function reg(user,pass) {
    $.ajax({
        url: "http://localhost:8888/register?user="+user+"&pw="+pass,
        success : function(data,err) {
	    alert(data);
        }
    });
}


function flag(id) {
    
    $.ajax({
        url: "http://localhost:8888/flag?ID="+id,
        success : function() {
            $("#flag"+id).html("Read");
        }
    });

}

function update() {
    var addMessage = function(data, err) {
        jQuery.each(data, function(i) {
            $("<div />", {
     		"class": "msg",
     		text: data[i]["post"],
     		"id": data[i]["_id"],

                "class": "message"
     	    }).prependTo("#divMessages");

            var postRead = "Not read";
            if (data[i]["read"] == 1) {
                postRead = "Read";
            }
                
            $("<div />", {
     		"class": "msgRead",
                "id": "flag"+data[i]["_id"],
     		text: postRead,
     		click: function() {
     		    flag(data[i]["_id"]);
     		}
     	    }).appendTo("#"+data[i]["_id"]);
        });
    };
    
    
    
    $.ajax({
        url: "http://localhost:8888/getall",
        dataType : "json",
        success : addMessage
    });
}

function clear() {
    $("#divMessages").html("");
}

function save(post) {
    $.ajax({
        url: "http://localhost:8888/save?POST="+post,
        success : function(err,data) {
            clear();
            update();
        }
    });
}
    