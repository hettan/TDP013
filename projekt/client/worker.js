/*
self.onmessage = function(e) {
    var user = e.data;
   
    function handler() {
        if (this.readyState == 4) {
            if (this.status == 200 || this.status == 304 || this.status ==0) {
                postMessage(this.responseText);
            } else {
                postMessage(this.status + this.responseText);
                throw  this.status + this.responseText;
            }
      }
    };
    
    setTimeout(function() {
        
        var xhrs = new XMLHttpRequest();
        xhrs.open('GET',"http://localhost:8888/profile?user="+user, true);
        xhrs.setRequestHeader('Accept', 'application/json');
        xhrs.onreadystatechange = handler;
        xhrs.send(null); },
               1000);
               
};
*/
var user = "";

self.onmessage = function(e) {
        user = e.data;
}

function handler() {
    if (this.readyState == 4) {
        if (this.status == 200 || this.status == 304 || this.status ==0) {
            postMessage(this.responseText);
        } else {
            postMessage(this.status + this.responseText);
            throw  this.status + this.responseText;
        }
    }
};

function loop() {
    if (user != "") {
        var xhrs = new XMLHttpRequest();
        xhrs.open('GET',"http://localhost:8888/profile?user="+user, true);
        xhrs.setRequestHeader('Accept', 'application/json');
        xhrs.onreadystatechange = handler;
        xhrs.send(null);
        setTimeout("loop()", 5000);
    }
    else {
        setTimeout("loop()", 10);
    }
}

loop();