$(document).ready(function() {

    //Login
    $("#go").click(function() {
     	var user = $("#user").val();
	var pass = $("#pass").val();
        $("#error").html("");
	login(user,pass);
    });

    //Register
    $("#register").click(function() {
        var reguser = $("#reguser").val();
        var regpass = $("#regpass").val();
        var regname = $("#regname").val();
        
        if(reguser.length == 0) {
            $("#err").html("Please Enter A Username");
        }
        else if(regpass.length == 0) {
            $("#err").html("Please Enter A Password");
        }
        else if(reguser.length > 19) {
            $("#err").html("Please Enter A Shorter Username");
        }
        else if(regname.length == 0) {
            $("#err").html("Please Enter A Name");
        }
        else {
            reg(reguser,regpass,regname); 
        }
    });

    //Nav-bar click
    $(".change").click(function() {
        if(sessionStorage.login!= undefined) {
            pauseWorker();
            
            if(this.id == "profile") {
                $.when(template(this.id)).done(function() {
                    prof(sessionStorage.login,sessionStorage.login);
                    unpauseWorker(sessionStorage.login,sessionStorage.login);
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
                    stopFriendsOnline();
                });
            }
        }
    });
    
    $("#home").click(function() {
        if(sessionStorage.login == undefined) {
            location.reload();
        }
    });

    //Post
    $("#sendpost").live('click', function() {
        //send post
        var username = $("#username").html();
        var post = $("#post").val();
        $.ajax({
            url: "http://localhost:8888/post?user="+sessionStorage.login
                +"&target="+username+"&text="+post,
            dataType: "json"            
        });

        //Remove text
        $("#post").val(""); 
    });

    //Friend in Friends click
    $(".friendlisted").live('click', function() {
        var id = this.id;
        $.when(template("profile")).done(function() {
            prof(sessionStorage.login,id);
            unpauseWorker(sessionStorage.login,id);
        });
    });

    //Search on "Enter" key
    $("#search").keydown(function(e) {
        if (e.keyCode == 13) {
            var query = $("#search").val();
            $.when(template("search")).done(function() {
                search(query);
                $("#search").val("");
                stopWorker();
            });
            
        }
    });

    //Search-result click
    $(".searchResult").live('click', function() {
        var id = this.id;
        $.when(template("profile")).done(function() {
            prof(sessionStorage.login,id);
            unpauseWorker(sessionStorage.login,id);
        });
    });

    //Add friend
    $("#friendadd").live('click', function() {
        var username = $("#username").html();
        $.ajax({
            url: "http://localhost:8888/add?user="+sessionStorage.login
                +"&target="+username,
            dataType: "json",
            success: function(data, err) {
                updateProf = true; //Force update -worker
            }
        });
        $("#friendadd").attr("disabled", "disabled");
        $("#friendadd span").text("Already Friends");
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

//Profile ajax-call, not used by worker
function prof(userprof, profile) {
    return $.ajax({
        url: "http://localhost:8888/profile?user="+userprof+"&target="+profile,
        dataType : "json",
        success : showProfile
    });
}

//Friends ajax-call
function friends() {
    return $.ajax({
        url: "http://localhost:8888/friends?user="+sessionStorage.login,
        dataType : "json",
        success : showFriends
    });
}

//Search ajax-call
function search(query) {
    $.ajax({
        url: "http://localhost:8888/search?q="+query,
        dataType: "json",
        success: showSearch
    });
}

//Login ajax-call
function log(user,pass) {
    return $.ajax({
        url: "http://localhost:8888/login?user="+user+"&pw="+pass,
        success : function(data,err) {
            if (data == "1") {
                sessionStorage.login = user;
                chatClient(user); //Login to chat
            }
            else if (data == "0") {
                $("#error").html("Wrong Password or Username");
            }
            else {
                $("#error").html("Database Error")
            }
        }
    });
}

function login(user,pass) {
    $.when(log(user, pass)).done(function(){
        if (sessionStorage.login != undefined) {
            $.when(template("profile")).done(function() {
                //Start the workers
                startFriendsOnline(user);
                startWorker(sessionStorage.login, sessionStorage.login);
                $("#chatOk").html("  <i class=\"icon-ok-circle\"></i>");
            });
        }
    });
}

//Logoff ajax-call
function logout() {
    return $.ajax({
        url: "http://localhost:8888/logoff?user="+sessionStorage.login,
        success : function(data,err) {
            sessionStorage.clear();
        }
    });
}

//Used by non-worker
function showProfile(data,err) {
    if(data["username"] == sessionStorage.login || data["friends"] == true) {
        $("#note").html(""); //remove the help text        
        $("#friendadd").attr('disabled','disabled')  //disable the friend button
        $('#friendadd span').text('Already Friends');
        
        $.map(data["posts"], function(post){
            var member = $(document.createElement("div"))
                .attr("class", "posts")
                .append("<pre>"+post["post"]+"</pre>")
                .append("<p class=\"postname\">"+"- "+post["user"]+"</p>")
            
            $("#oldposts").prepend(member);
        });
    }
    else {
        $("#friendadd").removeAttr("disabled") // Enable friendadd again
        $('#friendadd span').text('Add Friend');
    }
    
    $("#username").html(data["username"]);
    $("#name").html(data["name"]);

}

function showFriends(data,err) {
    for(var i = 0; i < data.length; i++) {
        //Add friend-element
        var flist = $(document.createElement("div"))
            .attr("class", "friendlisted")
            .attr("id", data[i]["user"])
            .append("<pre>" + data[i]["name"] + "</pre>")
        $("#friendlist").append(flist);
    }
}

function showSearch(data,err) {
    for(var i=0; i < data.length; i++) {
        //Add result-element
        var slist = $(document.createElement("div"))
            .attr("class", "searchResult")
            .attr("id", data[i]["user"])
            .append("<pre>" + data[i]["name"] + "</pre>")

        $("#searchlist").append(slist);
    }
}

//Register ajax-call
function reg(user,pass,name) {
    $.ajax({
        url: "http://localhost:8888/register?user="+user+"&pw="+pass+"&name="+name,
        success : function(data,err) {
            $("#err").html(data);
            if(data == "Congratulations! Your account has been successfully registred.") {
                $("#Regdrop").modal("hide")
	    }
        }
    });
}

function showOnlineFriends(data) {
    //Reload online friends
    $('#of').html("");
    $('#amountOnline span').text('Online Friends: ' + data.length);

    for(var i = 0; i < data.length; i++) {
        var flist = $(document.createElement("li"))
            .attr("class", "noGroup")
            .attr("id", "online" + data[i]["user"])
            .attr("onClick", "addToChat(" + data[i]["user"] + ")")
            .append("<a tabindex=\"-1\" href=\"#\">" + data[i]["user"] + "</a>")
        
        $("#of").append(flist);
    }
}


/************************
*      Workers
************************/

var friendsOnline;
function startFriendsOnline(user) {
    if(typeof(Worker)!=="undefined") {
        if(typeof(worker)=="undefined") {
            friendsOnline = new Worker('friendsOnline.js');
        }
        friendsOnline.onmessage = function(event) {
            var data = jQuery.parseJSON(event.data);
            showOnlineFriends(data);
        }
        
        friendsOnline.postMessage(user);
    }       
}

function stopFriendsOnline() {
    friendsOnline.terminate();
}

var worker;
var updateProf = true; //Force update
function startWorker(user,target) {
    if(typeof(Worker)!=="undefined") {
        if(typeof(worker)=="undefined") {
            worker = new Worker('worker.js');
        }
        
        worker.onmessage = function(event) {        
            var data = jQuery.parseJSON(event.data);
            var newPosts = data["posts"].length - $("#oldposts").children().length;
            
            //Any update required?
            if (newPosts > 0 || updateProf) {

                //Check if friends
                if(data["username"] == sessionStorage.login || data["friends"] == true) {
                    $("#note").html(""); //remove the help text        
                    $("#friendadd").attr('disabled','disabled')  //disable the friend button
                    $('#friendadd span').text('Already Friends');
                }
                else {
                    $("#friendadd").removeAttr("disabled") // Enable friendadd again
                    $('#friendadd span').text('Add Friend');
                }
                updateProf = false;

                //Add posts
                for(var i=data["posts"].length - newPosts; i < data["posts"].length; i++) {
                    var post = data["posts"][i];
                    var member = $(document.createElement("div")) 
                        .attr("class", "posts")
                        .append("<pre>"+post["post"]+"</pre>")
                        .append("<p class=\"postname\">"+"- "+post["user"]+"</p>")
                    
                    $("#oldposts").prepend(member);
                };
            }
            
            $("#username").html(data["username"]);
            $("#name").html(data["name"]);
            
        };
        
        //First postMessage is to let worker know what variable to set
        worker.postMessage("user");
        worker.postMessage(user);
        
        worker.postMessage("target");
        worker.postMessage(target);
    }
    else
    {
        alert("Sorry, your browser does not support Web Workers!");
    }
}

function pauseWorker() {
    //First postMessage is to let worker know what variable to set
    worker.postMessage("pause");
    worker.postMessage("1");
}

function unpauseWorker(user,target) {
    //First postMessage is to let worker know what variable to set
    worker.postMessage("user");
    worker.postMessage(user);
    
    worker.postMessage("target");
    worker.postMessage(target);
    
    worker.postMessage("pause");
    worker.postMessage("0");
}

function stopWorker()
{
    worker.terminate();
}