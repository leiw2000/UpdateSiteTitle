'use strict';

var context;
var hostweburl;
var appweburl;
var appContextSite;
var web;

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', getUrl);
});
function getUrl() {
    hostweburl = getQueryStringParameter("SPHostUrl");
    appweburl = getQueryStringParameter("SPAppWebUrl");
    hostweburl = decodeURIComponent(hostweburl);
    appweburl = decodeURIComponent(appweburl);
    var scriptbase = hostweburl + "/_layouts/15/";
    $.getScript(scriptbase + "SP.Runtime.js",
        function () {
            $.getScript(scriptbase + "SP.js",
            function () { $.getScript(scriptbase + "SP.RequestExecutor.js", execOperation); }
            );
        }
    );
}

function execOperation() {
    context = new SP.ClientContext(appweburl);
    var factory =
        new SP.ProxyWebRequestExecutorFactory(
            appweburl
        );
    context.set_webRequestExecutorFactory(factory);
    appContextSite = new SP.AppContextSite(context, hostweburl);
    web = appContextSite.get_web();
    context.load(web);
    
    context.executeQueryAsync(onSuccess, onFail);
}
function onSuccess() {
  
    var currentTitle = web.get_title();
    $('#texTitle').text(currentTitle);
}

// This function is executed if the above call fails
function onFail(sender, args) {
    alert(args.get_message());
}

function UpdateSPWebTitle() {
   
    var newTitle;
    newTitle = $.trim($('#texTitleNew').val());
    if (newTitle != "") {
        web.set_title(newTitle);
        web.update();
        context.executeQueryAsync(SuccessUpdate, FailureUpdate);
    }
}

function SuccessUpdate() {
    $('#message').text("Update Call succeeded!");
    alert("Update Call succeeded");
}

function FailureUpdate() {
    alert("Update Call failed");
}

// Utility functions
function getQueryStringParameter(paramToRetrieve) {
    var params = document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve) {
            return singleParam[1];
        }
    }
}
