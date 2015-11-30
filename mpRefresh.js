/*

    mpRefresh.js

    Copyright (c)2015 Charles Boyd (charlesboyd.me). All rights reserved.
    
*/

var mpRefresh = function(){

    var refreshIntervalS = 20; //In Seconds (default)
    var timer = null;
    var status = "init"
    var log = true;
    var previousPage = null;

    var requestPage = function(){
        console.log("requesting");
        return;
    
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        }else{
            //For IE6 and before
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                responseRecieved(xhttp.responseText);
            }else if(xhttp.readyState == 4){
                requestError();
            }else{}
        };
        
        var pageURL = window.location.href;
        
        xhttp.open("GET", pageURL, true);
        xhttp.send();
    };
    
    
    var responseRecieved = function(newHTML){
        if(typeof newHTML != "string" || newHTML.length<10){
            requestError();
            return;
        }
    
        if(previousPage==null){
            previousPage = newHTML;
            return;
        }
        
        var newBody = getStringBetween(newHTML, "<body>", "</body>").trim();
        var oldBody = getStringBetween(previousPage, "<body>", "</body>").trim();
        
        if(newBody==oldBody){
            if(log){ console.log("No Updates"); }
        }else{
            if(log){ console.log("Updated. FYI New Body Length: "+newBody.length+", Old Body Length: "+oldBody.length); }
            document.getElementsByTagName('body')[0].innerHTML = newBody;
        }
        
        previousPage = newHTML;
        
    };
    
    var getStringBetween = function(haystack, first, last){
        if(typeof last == "undefined"){ last = first; }
        return haystack.substring(haystack.lastIndexOf(first)+first.length,haystack.lastIndexOf(last));
    };
    
    var requestError = function(){
        console.log("Request Error! Stopping...");
        stop();
    };
    
    var currentBody = {
        get:
            function(){
                return document.getElementsByTagName('body')[0].innerHTML;
             },
        set:
            function(newBody){
                document.getElementsByTagName('body')[0].innerHTML = newBody;
            }
    };
    
    
    var start = function(){
        requestPage(); //Inital Request
        
        window.addEventListener('focus', windowRefocus);
        window.addEventListener('blur', windowBlur);
        
        status="paused";
        restart();
    };
    
    var restart = function(){
        if(status!="paused"){
            throw new Error("Need to pause or call start() first");
        }
        timer = setInterval(requestPage, refreshIntervalS*1000);
        status="running";
    };
    
    var pause = function(){
        if(status=="running"){
            clearInterval(timer);
        }
        timer = null;
        status="paused";
    };
    
    var stop = function(){
        pause();
        previousPage=null;
        
        window.removeEventListener('focus', windowRefocus);
        window.removeEventListener('blur', windowBlur);
        
        status="stopped";
    };
    
    var windowRefocus = function(){
        if(status=="tabhidden"){
            status="paused";
            restart();
        }
    }
    
    var windowBlur = function(){
        if(status=="running"){
            pause();
            status="tabhidden";
        }
    }
    
    var setRefreshInterval = function(newInterval){
        refreshIntervalS = newInterval;
        if(status=="running"){
            pause();
            restart();
        }
    };
    
    var setLogging = function(logOnOff){
        log = logOnOff;
    }
    
    var getStatus = function(){
        return status;
    }
    
    
    //Public Functions
    return {
        start:start,
        stop:stop,
        restart:restart,
        pause:pause,
        setRefreshInterval:setRefreshInterval,
        setLogging:setLogging,
        getStatus:getStatus
    };

}();