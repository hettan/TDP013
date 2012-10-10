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
        if(sessionStorage.login!= undefined) {
            
            if(this.id == "profile") {
                $.when(template(this.id)).done(function() {
                    prof(sessionStorage.login);
                });
            }
            else if(this.id == "friends") {
                $.when(template(this.id)).done(function() {
                    friends();
                });
            }
            else if(this.id == "logout") {
                $.when(template(this.id)).done(function() {
                    logout();
                });
            }
            else if(this.id == "home") {
                
            }
        }
        else {
            alert("your not logged in dipshit");
        }
    });
    
    $("#home").click(function() {
        if(sessionStorage.login == undefined) {
            location.reload();
        }
    });
                     
    $("#sendpost").live('click', function() {
        $.ajax({
        });
    });
    
    $(".friendlisted").live('click', function() {
       
    });

    $("#search").keydown(function(e) {
        if (e.keyCode == 13) {
            var query = $("#search").val();
            $.when(template("search")).done(function() {
                search(query);
                $("#search").val("");
            });
                                          
        }
    });

    $(".searchResult").live('click', function() {
        var id = this.id;
        $.when(template("profile")).done(function() {
            prof(id);
        });
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
        url: "http://localhost:8888/friends?user="+sessionStorage.login,
        dataType : "json",
        success : showFriends
    });
}

function onlineFriends() {
    return $.ajax({
        url: "http://localhost:8888/online?user="+sessionStorage.login,
        dataType: "json",
        success: showOnlineFriends
    });
}

function search(query) {
    $.ajax({
        url: "http://localhost:8888/search?q="+query,
        dataType: "json",
        success: showSearch
    });
}
        

function log(user,pass) {
    return $.ajax({
        url: "http://localhost:8888/login?user="+user+"&pw="+pass,
        success : function(data,err) {
            if (data == "1") {
                sessionStorage.login = user;
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
        if (sessionStorage.login != undefined) {
            $.when(template("profile")).done(function() {
                $.when(onlineFriends()).done(function() {
                    startWorker(sessionStorage.login);
                });
            });
        }
    });
}

function logout() {
    return $.ajax({
        url: "http://localhost:8888/logoff?user="+sessionStorage.login,
        success : function(data,err) {
            sessionStorage.clear();
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

function showSearch(data,err) {
    for(var i=0; i < data.length; i++) {
        var slist = $(document.createElement("div"))
            .attr("class", "searchResult")
            .attr("id", data[i]["user"])
            .append("<pre>" + data[i]["name"] + "</pre>")

        $("#searchlist").append(slist);
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

var worker;

function startWorker(user)
{
    if(typeof(Worker)!=="undefined")
    {
        if(typeof(worker)=="undefined")
        {
            worker = new Worker('worker.js');
        }
        worker.onmessage = function(event) {
            var data = jQuery.parseJSON(event.data);
            $.map(data["posts"], function(post){
                var member = $(document.createElement("div"))
                    .attr("class", "posts")
                    .append("<pre>"+post["post"]+"</pre>")
                    .append("<p class=\"postname\">"+"- "+post["user"]+"</p>")
                
                $("#oldposts").prepend(member);
            });

            $("#username").html(data["username"]);
        };
        //worker.postMessage("1");
        getPosts(user);
    }
    else
    {
        document.getElementById("res").innerHTML="Sorry, your browser does not support Web Workers...";
    }
}

function stopWorker()
{
    worker.terminate();
}

function getPosts(user) {
    worker.postMessage(user);
}