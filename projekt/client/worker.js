self.onmessage = function(e) {
    
    function getProfile(user) {
        var xhrs = new XMLHttpRequest();
        xhrs.open('GET',"http://localhost:8888/profile?user="+user, true);
        xhrs.setRequestHeader('Accept', 'application/json');
        xhrs.onreadystatechange = handler;
        xhrs.send(null);
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
    getProfile(e.data);
    setTimeout(getProfile(e.data), 5000);
           
};