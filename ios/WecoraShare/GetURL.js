var GetURL = function () { };

GetURL.prototype = {
    run: function (arguments) {
        arguments.completionFunction({"value": JSON.stringify({
            "currentUrl": document.URL,
            "currentTitle": document.title,
            "html": document.documentElement.outerHTML,
        })});
    }
};

var ExtensionPreprocessingJS = new GetURL;