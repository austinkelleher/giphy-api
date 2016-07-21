/* globals XMLHttpRequest, setTimeout, clearTimeout */

exports.get = function(options, resolve, reject) {
    var request = options.request;
    var timeout = options.timeout;
    var fmt = options.fmt;

    var timerId = setTimeout(function() {
        reject(new Error('Timeout while fetching asset'));
    }, timeout);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    var onFail = function(err) {
        clearTimeout(timerId);
        err = err || new Error('Giphy API request failed!');
        reject(err);
    };

    xhr.addEventListener('error', onFail);
    xhr.addEventListener('abort', onFail);
    xhr.addEventListener('load', function() {
        clearTimeout(timerId);
        var body = xhr.response;

        if (fmt !== 'html') {
            body = JSON.parse(body);
        }
        resolve(body);
    });

    var protocol = options.https ? 'https' : 'http';
    var host = request.host;
    var path = request.path;
    var url = protocol + '://' + host + path;

    xhr.open('GET', url, true);
    xhr.send();
};
