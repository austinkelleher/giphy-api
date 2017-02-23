var http = require('http');
var https = require('https');

/**
 * Non-browser based GET request
 * @param options {Object}
 *   options.request {Object} - Request data including host and path
 *   options.https {Boolean} - Whether to utilize HTTPS library for requests or HTTP. Defaults to HTTP.
 *   options.timeout {Number} - Request timeout before returning an error. Defaults to 30000 milliseconds
 *   options.fmt {String} - Return results in html or json format (useful for viewing responses as GIFs to debug/test)
 */
exports.get = function (options, resolve, reject) {
  var httpService = options.https ? https : http;
  var request = options.request;
  var timeout = options.timeout;
  var fmt = options.fmt;

  request.withCredentials = false;

  var req = httpService.get(request, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      if (fmt !== 'html') {
        body = JSON.parse(body);
      }
      resolve(body);
    });
  });

  req.on('error', function (err) {
    reject(err);
  });

  req.on('socket', function (socket) {
    socket.setTimeout(timeout);
    socket.on('timeout', function () {
      req.abort();
    });
  });
};
