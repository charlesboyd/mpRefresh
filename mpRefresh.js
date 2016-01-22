/*

    mpRefresh.js

    Copyright (c)2015 Charles Boyd <http://charlesboyd.me>

    Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. View the `license.txt` file or visit <http://www.apache.org/licenses/LICENSE-2.0> to obtain a copy of the License.
   
    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
    
    Sample Usage:
    
        <script src="mpRefresh.js"></script>
        <script>
            mpRefresh.setRefreshInterval(10);
            mpRefresh.start();
        </script>
 
*/

var mpRefresh = (function(){

    var refreshIntervalS = 20; //Default interval in Seconds
    var timer = null;
    var status = "init";
    var log = false;
    var previousPage = null;
    var errorDiv = null;
    var pauseOnHide = false;    //Set to true to temporarily stop refeshing when the user is no longer focused on the page.

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
        
        var extractBody = function(fullPageString){
            var body = getStringBetween(fullPageString, "<body", "</body>");
            var closeBracketIndex = body.indexOf(">");
            if(closeBracketIndex==-1){
                requestError();
                return;
            }
            body = body.substring(closeBracketIndex+1);
            body = body.trim();
            return body;
        }
        
        var newBody = extractBody(newHTML);
        var oldBody = extractBody(previousPage);
        
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
    };
    
    var windowBlur = function(){
        if(status=="running" && pauseOnHide==true){
            pause();
            status="tabhidden";
        }
    };
    
    var setRefreshInterval = function(newInterval){
        refreshIntervalS = newInterval;
        if(status=="running"){
            pause();
            restart();
        }
    };
    
    var setLogging = function(logOnOff){
        log = logOnOff;
    };
    
    var getStatus = function(){
        return status;
    };
    
    var setPauseOnHide = function(yesno){
        pauseOnHide = yesno;
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

}());