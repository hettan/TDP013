/*
self.onmessage = function(event) {
    alert(event.data);
    $.ajax({
        url: "http://localhost:8888/profile?user="+event.data,
        dataType : "json",
        success : self.postMessage("ok")
    });
};
*/
self.onmessage = function(e) {
    
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
    
    var xhrs = new XMLHttpRequest();
    xhrs.open('GET',"http://localhost:8888/profile?user="+e.data, true);
    xhrs.setRequestHeader('Accept', 'application/json');
    xhrs.onreadystatechange = handler;
    xhrs.send(null);
};