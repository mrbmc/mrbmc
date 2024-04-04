function loadXHR (url, mimeType, callback) {
    // if(DEBUG) console.log("loadXHR",arguments);
    var xhr = new XMLHttpRequest();
        xhr.overrideMimeType(mimeType);
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            // if(DEBUG) console.log("xhr.onreadystatechange",arguments);
            if (xhr.readyState == 4 && xhr.status == "200") {
                callback(xhr);
            }
        }
        xhr.send(null);
}

function loadJSON(url, callback) {
    if(DEBUG) console.log("loadJSON",arguments);
    loadXHR(url, "application/json",function (xhr) {
        var data = JSON.parse(xhr.responseText);
        callback(data);
    });
}
function loadMarkdown (url, callback) {
    if(DEBUG) console.log("loadMarkdown",arguments);
    loadXHR(url, "text/markdown", function (xhr) {
        var data = parseMarkdown(xhr.responseText);
        callback(data);
    });
}
function loadYAML (url, callback) {
    if(DEBUG) console.log("loadYAML",arguments);
    loadXHR(url, "text/x-yaml", function (xhr){
        if(xhr.responseText.indexOf('---\n')>=0) {
            var data = parseYAML(xhr.responseText);
        } else {
            var data = xhr.responseText;
        }
        callback(data);
    });
}

