/*

var w;

function startWorker()
{
    if(typeof(Worker)!=="undefined")
    {
        if(typeof(w)=="undefined")
    {
        alert("yolo");
        w=new Worker("worker.js");
    }
        w.onmessage = function (event) {
            document.getElementById("res").innerHTML=event.data;
        };
    }
    else
    {
        document.getElementById("res").innerHTML="Sorry, your browser does not support Web Workers...";
    }
}

function stopWorker()
{
    w.terminate();
}

startWorker();

*/