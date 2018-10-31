var http = require('http');
var https = require('https');

exports.create = function (httpsEnabled) {
  return httpsEnabled ? https : http;
};

/**
 * Non-browser based GET request
 * @param options {Object}
 *   options.httpService {Object} - The HTTP service to use. Created using the `create` function above.
 *   options.request {Object} - Request data including host and path
 *   options.timeout {Number} - Request timeout before returning an error. Defaults to 30000 milliseconds
 *   options.fmt {String} - Return results in html or json format (useful for viewing responses as GIFs to debug/test)
 */
exports.get = function (options, resolve, reject) {
  var httpService = options.httpService;
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
