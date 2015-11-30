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
    var errorDiv = null;

    var requestPage = function(){
    
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
        }else{
            if(errorDiv!=null){
                errorDiv.style.display="none";
            }
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
        if(log){ console.log("Request Error! Pausing..."); }
        
        stop();
        
        if(errorDiv==null){
            errorDiv = document.createElement('div');
            var p = document.createElement('p');
            var link = document.createElement('link');

            errorDiv.id = 'mprefresherrormessage';
            errorDiv.style.cssText ="display:block; width: 100%; padding: 10px 0; margin: 0; background-color: #FFD712;";

            p.innerHTML = "<span class='title'>You are offline. &nbsp;&nbsp; <a href='#' onclick='mpRefresh.start();' style='color:#000'>Refresh Now</a>";
            p.style.cssText = "color: #000; font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 16px; text-align: center; font-weight: bold; padding: 0;margin: 0;";


            errorDiv.appendChild(p);
            document.body.insertBefore(errorDiv, document.body.firstChild);

            link.href = '//cdn01.its.msstate.edu/i/emergency/1.4/hazard.css';
            link.media = 'screen';
            link.rel = 'stylesheet';
            document.body.appendChild(link);
        }else{
            errorDiv.style.display = "block";
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
        requestPage();
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