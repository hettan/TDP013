var user = "";
var target = "";
var nextData = "";
var pause = false;
var varRcvd = false;
var counter = 0;

onmessage = function(e) {
    counter += 1;
    if (!varRcvd) {
        varRcvd = true;
        nextData = e.data;
    }
    else {
        if (nextData == "user") {
            user = e.data;
            varRcvd = false;
            //postMessage("user="+user+"   " + counter);
        }
        else if(nextData == "target") {
            target = e.data;
            varRcvd = false;
            //postMessage("target="+target+"   " + counter);
        }
        else if(nextData == "pause") {
            //postMessage("pause"+e.data+"   " + counter);
            pause = (e.data == "1");
            if (!pause) {
                clearTimeout();
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
            setTimeout("loop()", 10);
        }
    }
}

loop();