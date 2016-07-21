const http = require('http');
const https = require('https');

exports.get = function(options, resolve, reject) {
    var httpService = options.https ? https : http;
    var request = options.request;
    var timeout = options.timeout;
    var fmt = options.fmt;

    // The environment is not the browser, so we
    // set withCredentials to false
    request.withCredentials = false;

    var req = httpService.get(request, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            if (fmt !== 'html') {
                body = JSON.parse(body);
            }
            resolve(body);
        });
    });

    req.on('error', function(err) {
        reject(err);
    });

    req.on('socket', function (socket) {
        socket.setTimeout(timeout);
        socket.on('timeout', function() {
            req.abort();
        });
    });
};
