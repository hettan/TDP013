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
        else if(reguser.length < 3) {
            alert("Too short username, Please enter a username between 3-19 character long");
        }
        else if(reguser.length > 19) {
            alert("Too long username, Please enter a username between 3-19 character long");
        }
        else {
            reg(reguser,regpass)
            $("#Regdrop").modal("hide")
        }
    });

    $(".change").click(function() {
        $.ajax({
            url: "http://localhost:8888/content?template="+this.id,
            success : function(data,err) {
                $("#content").html(data);
            }
        });
    });

    $("#sendpost").click(function() {
        showProfile(1);
    });

});

function showProfile(user) {
    var addMessage = function(data, err) {
        alert("2345678");
        jQuery.each(data["posts"], function(i) {
            alert(data["name"]);
            var newText = $("<div />", {
     		text: data["posts"][i]["post"],
     	    });
            
            var newUser = $("<div />", {
     		text: data["posts"][i]["name"],
     	    });

            $("<div />", {
                "class": "posts"
            }).add(newText).prepend("#oldPosts");
            alert(data["name"]);
        });
    };
    
    
    
    $.ajax({
        url: "http://localhost:8888/profile?user="+user,
        dataType : "json",
        success : addMessage
    });
}


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
    