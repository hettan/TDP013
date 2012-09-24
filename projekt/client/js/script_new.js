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

function search(value, callback) {
    $.ajax({
        url: "http://localhost:8888/search?q=" + value,
        success : function(data,err) {
	    
        }
    });
}

$(document).ready(function() {
    alert("tjata");
    $("#go").click(function() {
     	var user = $("#user").val();
	var pass = $("#pass").val();
	login(user,pass);
    });
/*
    var items = ["YouTube", "Google", "Facebook"];
    $("#txtInput").typeahead({
       
        source: function(typeahead) {
            var arr = new Array();
            $.ajax({
                url: "http://localhost:8888/search?q=" + $("#txtInput").val(),
                success : function(data) {

                    var obj = JSON.parse(data);
                    jQuery.each(obj, function(i) {
                        arr.push(JSON.stringify(obj[i]["name"]));
                    });
                    //alert(arr);
                    var items = ["YouTube", "Google", "Facebook"];
                    typeahead.process(items);
                }
            });

        }
    });
*/
    var labels
  , mapped
$("input").typeahead({
  source: function (query, process) {
    $.get('/autocomplete', { q: query }, function (data) {
      labels = []
      mapped = {}

      $.each(data, function (i, item) {
        mapped[item.label] = item.value
        labels.push(item.label)
      })

      process(labels)
    })
  }
, updater: function (item) {
    return mapped[item]
  }
})

        /*
        source: function(query, maxResults, callback){
            // Do any sort of asynchronous action and when complete, call 
            //  `callback` with an array of items.
            $.get('http://myurl.com/search', { 
                q: query, 
                limit: maxResults 
            }, function(data){
                callback(data.items);
        });
        },
        valueField: 'id', // field in items to be used for the value of the item
        labelField: 'label' // field in items to be used for the displayable value of the item
        */
   
});
