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
            alert("Too long username, Please enter a username between 3-19 character long"); // FIIIIIIIIIIIIIIIIIIIIIIIIIIX

        }
        else {
            reg(reguser,regpass)
            $("#Regdrop").modal("hide") 
        }
    });
    
    $(".change").click(function() {
        if(loggedInUser!= "") {
            
            if(this.id == "profile") {
                template(this.id);
                prof(loggedInUser);
            }
            else if(this.id == "friends") {
                template(this.id);
                friends();
            }
            else if(this.id == "logout") {
                template(this.id);
                logout();
            }
            else if(this.id == "home") {
                
            }
        }
        else {
            alert("your not logged in dipshit");
        }
    });
    
    $("#home").click(function() {
        if(loggedInUser == "") {
            location.reload();
        }
    });
                     
    $("#sendpost").live('click', function() {
        $.ajax({
        });
    });
    
    $(".friendlisted").live('click', function() {
       
    });
    
}); //End document ready

function template(thisid) {
    return $.ajax({
        url: "http://localhost:8888/content?template="+thisid,
        success : function(data,err) {
            $("#content").html(data);
        }
    });
}

function prof(userprof) {
    return $.ajax({
        url: "http://localhost:8888/profile?user="+userprof,
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

function onlineFriends() {
    return $.ajax({
        url: "http://localhost:8888/online?user="+loggedInUser,
        dataType: "json",
        success: showOnlineFriends
    });
}

function log(user,pass) {
    return $.ajax({
        url: "http://localhost:8888/login?user="+user+"&pw="+pass,
        success : function(data,err) {
            if (data == "1") {
                loggedInUser = user;
                chatClient(user);
            }
            else if (data == "0") {
                alert("Wrong username or password!");
            }
            else {
                alert("Database error");
            }
        }
    });
}


function login(user,pass) {
    $.when(log(user, pass)).done(function(){
        if (loggedInUser != "") {
            $.when(template("profile")).done(function() {
                $.when(prof(loggedInUser)).done(function() {
                    onlineFriends();
                });
            });
        }
    });
}

function logout() {
    return $.ajax({
        url: "http://localhost:8888/logoff?user="+loggedInUser,
        success : function(data,err) {
            loggedInUser = "";
        }
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
    for(var i = 0; i < data.length; i++) {
        var flist = $(document.createElement("div"))
            .attr("class", "friendlisted")
            .append("<pre>" + data[i] + "</pre>")
        
        $("#friendlist").append(flist);
    }
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

function showOnlineFriends(data,err) {
    for(var i = 0; i < data.length; i++) {
        var flist = $(document.createElement("div"))
            .attr("class", "friendOnline")
            .attr("id", "online" + data[i]["user"])
            .attr("onClick", "addToChat(" + data[i]["user"] + ")")
            .append("<pre>" + data[i]["name"] + "</pre>")
        
        $("#onlineFriends").append(flist);
    }
}