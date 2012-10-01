var loggedInUser = "";

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
            alert("Pls enter username");// FIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIX
        }
        else if(regpass.length == 0) {
            alert("Plz enter a password");// FIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIX
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
        alert(this.id);
        if(loggedInUser!= "") {

            template(this.id);
            
            if(this.id == "profile") {
                userprof();
            }
            else if(this.id == "friends") {
                friends();
            }
            else if(this.id == "logout") {
                
            }
        }
        else {
            alert("Your not logged in dipshit!"); // FIIIIIIIIIIIIIIIIIIIIIIIX
        }

    });

    $("#sendpost").live('click', function() {
        $.ajax({
        });
    });
    
});

function template(thisid) {
    return $.ajax({
        url: "http://localhost:8888/content?template="+thisid,
        success : function(data,err) {
            $("#content").html(data);
        }
    });
}

function userprof() {
    return $.ajax({
        url: "http://localhost:8888/profile?user="+loggedInUser,
        dataType : "json",
        success : showProfile
    });
}

function friends() {
    return $.ajax({
        url: "http://localhost:8888/friends?user="+loggedInUser,
        dataType : "json",
        success : showFriends
    });
}

function log(user,pass) {
    return $.ajax({
        url: "http://localhost:8888/login?user="+user+"&pw="+pass,
        success : function(data,err) {
	    alert(data); // FIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIX
            loggedInUser = user;
        }
    });
}


function login(user,pass) {
    $.when(log(user, pass)).done(function(){
        $.when(template("profile")).done(function() {
            userprof();
        });
    });
}

function showProfile(data,err) {
    $.map(data["posts"], function(post){
        var member = $(document.createElement("div"))
            .attr("class", "posts")
            .append("<pre>"+post["post"]+"</pre>")
            .append("<p class=\"postname\">"+"- "+post["user"]+"</p>")
        
        $("#oldposts").prepend(member);
    });

    $("#username").html(data["username"]);
}

function showFriends(data,err) {
    alert(data);
    var member = $(document.createElement("div"))
        .attr("class", "friendlisted")
        .append("<pre>" + data + "</pre>")

    $("#friendlist").html(member);
    alert("derps");
}

function reg(user,pass) {
    $.ajax({
        url: "http://localhost:8888/register?user="+user+"&pw="+pass,
        success : function(data,err) {
	    alert(data);// FIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIX
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
    