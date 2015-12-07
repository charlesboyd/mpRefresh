# mpRefresh.js

[![License Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-green.svg)](https://github.com/charlesboyd/mpRefresh/blob/master/LICENSE.txt)

A JavaScript object (created from self-invoked function) to continuously refresh a webpage using AJAX.   

Designed for use with repeatedly updated code samples presented during a live university lecture allowing students can view entire samples on their personal devices in real-time. Current implementations use Dropbox to host and sync the webpages containing code samples.   

##Links
Hosted latest version: http://app.powerimage.biz/mpRefresh-latest.js   
Demo: TBA   

##To Use
Place the following lines in your webpage:   
```
    <script src="http://app.powerimage.biz/mpRefresh-latest.js"></script>
    <script>
        mpRefresh.setRefreshInterval(10);
        mpRefresh.start();
    </script>
```


##Methods
TBA   


##Notice
Copyright ©2015 [Charles Boyd](http://charlesboyd.me).  

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. View the `license.txt` file or visit [the apache website](http://www.apache.org/licenses/LICENSE-2.0) to obtain a copy of the License.   
   
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.   
   