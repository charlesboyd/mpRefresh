/*

    mpRefresh.js

    Copyright (c)2015 Charles Boyd (charlesboyd.me). All rights reserved.
    
*/

var mpRefresh = function(){

    var refreshIntervalS = 10; //In Seconds (default)
    var timer = "init";
    
    var previousPage = null;

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
        }
    
        if(previousPage==null){
            previousPage = newHTML;
            return;
        }
        
        var newBody = getStringBetween(newHTML, "<body>", "</body>").trim();
        var oldBody = getStringBetween(previousPage, "<body>", "</body>").trim();
        
        if(newBody==oldBody){
            console.log("Same; No Updates.");
        }else{
            console.log("Updated: "+newBody.length+" vs "+oldBody.length);
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
        timer = setInterval(requestPage, refreshIntervalS*1000);
    };
    
    var stop = function(){
        if(typeof timer!="string"){
            clearInterval(timer);
        }
        timer = "stopped";
    };
    
    var setRefreshInterval = function(newInterval){
        refreshIntervalS = newInterval;
        stop();
        start();
    };
    
    requestPage(); //TEMP
    start();
    
    //Public Functions
    return {
        stop:stop,
        start:start,
        setRefreshInterval:setRefreshInterval
    };

}();