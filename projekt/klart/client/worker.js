var user = "";
var target = "";
var nextData = ""; //Next variable to set
var pause = false;
var varRcvd = false;

onmessage = function(e) {
    
    //Do we know what variable to set?
    if (!varRcvd) {
        varRcvd = true;
        nextData = e.data;
    }
    else {
        //Set user
        if (nextData == "user") {
            user = e.data;
            varRcvd = false;
        }
        //Set target
        else if(nextData == "target") {
            target = e.data;
            varRcvd = false;
        }
        //Set pause
        else if(nextData == "pause") {
            pause = (e.data == "1");
            if (!pause) {
                loop();
            }
            varRcvd = false;
        }
    }
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
    if (!pause) {
        if (target != "") {
            var xhrs = new XMLHttpRequest();
            xhrs.open('GET',"http://localhost:8888/profile?user="+user+"&target="+target, true);
            xhrs.setRequestHeader('Accept', 'application/json');
            xhrs.onreadystatechange = handler;
            xhrs.send(null);
            setTimeout("loop()", 5000);
        }
        else {
            //Loop with 10ms until target is set
            setTimeout("loop()", 10);
        }
    }
}

loop();