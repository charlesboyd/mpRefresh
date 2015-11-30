/*

    mpRefresh.js

    Copyright (c)2015 Charles Boyd (charlesboyd.me). All rights reserved.
    
*/

var mpRefresh = function(){

    var refreshIntervalS = 30;

    console.log("Hello World");

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
        console.log(pageURL);
        
        xhttp.open("GET", pageURL, true);
        xhttp.send();
    };
    
    var responseRecieved = function(newHTML){
        console.log(newHTML);
    }
    
    var requestError = function(){
        console.log("Request Error!");
    }
    
    
    
    requestPage();

}();