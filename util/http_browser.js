/* globals XMLHttpRequest */

exports.create = function () {
  return this;
};

/**
 * Browser based GET request
 * @param options {Object}
 *   options.request {Object} - Request data including host and path
 *   options.https {Boolean} - Whether to utilize HTTPS library for requests or HTTP. Defaults to HTTP.
 *   options.timeout {Number} - Request timeout before returning an error. Defaults to 30000 milliseconds
 *   options.fmt {String} - Return results in html or json format (useful for viewing responses as GIFs to debug/test)
 */
exports.get = function (options, resolve, reject) {
  var request = options.request;
  var timeout = options.timeout;
  var fmt = options.fmt;

  var timerId = setTimeout(function () {
    reject(new Error('Timeout while fetching asset'));
  }, timeout);

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  var onFail = function (err) {
    clearTimeout(timerId);
    err = err || new Error('Giphy API request failed!');
    reject(err);
  };

  xhr.addEventListener('error', onFail);
  xhr.addEventListener('abort', onFail);
  xhr.addEventListener('load', function () {
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
