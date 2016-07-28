(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GiphyAPI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var queryString = require('querystring');
var httpService = require('./util/http');

/**
* Hostname of the Giphy API
*/
var API_HOSTNAME = 'api.giphy.com';
/**
* Base PATH of the Giphy API
*/
var API_BASE_PATH = '/v1/';
/**
* Public API key provided by Giphy for anyone to use. This is used as a fallback
* if no API key is provided
*/
var PUBLIC_BETA_API_KEY = 'dc6zaTOxFJmzC';
/**
* True if promises exist in this engine. Otherwise false.
*/
var promisesExist = typeof Promise !== 'undefined';

/**
* Error handler that supports promises and callbacks
* @param err {String} - Error message
* @param callback
*/
function _handleErr(err, callback) {
    if (callback) {
        return callback(err);
    } else if (promisesExist) {
        return Promise.reject(err);
    } else {
        throw new Error(err);
    }
}

/**
* @param options {String|Object} - Options object. If this is a string, it is considered the api key
*   options.https {Boolean} - Whether to utilize HTTPS library for requests or HTTP. Defaults to HTTP.
*   options.timeout {Number} - Request timeout before returning an error. Defaults to 30000 milliseconds
*   options.apiKey {String} - Giphy API key. Defaults to the public beta API key
*/
var GiphyAPI = function(options) {
    if (typeof options === 'string' ||
        typeof options === 'undefined' ||
        options === null) {
        this.apiKey = options || PUBLIC_BETA_API_KEY;
        options = {};
    } else if (typeof options === 'object') {
        this.apiKey = options.apiKey || PUBLIC_BETA_API_KEY;
    } else {
        throw new Error('Invalid options passed to giphy-api');
    }

    this.https = options.https;
    this.timeout = options.timeout || 30000;
};

GiphyAPI.prototype = {
    /**
    * Search all Giphy gifs by word or phrase
    *
    * @param options Giphy API search options
    *   options.q {String} - search query term or phrase
    *   options.limit {Number} - (optional) number of results to return, maximum 100. Default 25.
    *   options.offset {Number} - (optional) results offset, defaults to 0.
    *   options.rating {String}- limit results to those rated (y,g, pg, pg-13 or r).
    *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
    * @param callback
    */
    search: function(options, callback) {
        if (!options) {
            return _handleErr('Search phrase cannot be empty.', callback);
        }

        return this._request({
            api: options.api || 'gifs',
            endpoint: 'search',
            query: typeof(options) === 'string' ? {
                q: options
            } : options
        }, callback);
    },

    /**
    * Search all Giphy gifs for a single Id or an array of Id's
    *
    * @param id {String} - Single Giphy gif string Id or array of string Id's
    * @param callback
    */
    id: function(id, callback) {
        var idIsArr = Array.isArray(id);

        if (!id || (idIsArr && id.length === 0)) {
            return _handleErr('Id required for id API call', callback);
        }

        // If an array of Id's was passed, generate a comma delimited string for
        // the query string.
        if (idIsArr) {
            id = id.join();
        }

        return this._request({
            api: 'gifs',
            query: {
                ids: id
            }
        }, callback);
    },

    /**
    * Search for Giphy gifs by phrase with Gify vocabulary
    *
    * @param options Giphy API translate options
    *   options.s {String} - term or phrase to translate into a GIF
    *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
    *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
    */
    translate: function(options, callback) {
        if (!options) {
            return _handleErr('Translate phrase cannot be empty.', callback);
        }

        return this._request({
            api: options.api || 'gifs',
            endpoint: 'translate',
            query: typeof(options) === 'string' ? {
                s: options
            } : options
        }, callback);
    },

    /**
    * Fetch random gif filtered by tag
    *
    * @param options Giphy API random options
    *   options.tag {String} - the GIF tag to limit randomness by
    *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
    *   options.fmt {Stirng} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
    */
    random: function(options, callback) {
        var reqOptions = {
            api: (options ? options.api : null) || 'gifs',
            endpoint: 'random'
        };

        if (typeof(options) === 'string') {
            reqOptions.query = {
                tag: options
            };
        } else if (typeof(options) === 'object') {
            reqOptions.query = options;
        } else if (typeof(options) === 'function') {
            callback = options;
        }

        return this._request(reqOptions, callback);
    },

    /**
    * Fetch trending gifs
    *
    * @param options Giphy API random options
    *   options.limit {Number} - (optional) limits the number of results returned. By default returns 25 results.
    *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
    *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
    */
    trending: function(options, callback) {
        var reqOptions = {
            endpoint: 'trending'
        };

        reqOptions.api = (options ? options.api : null) || 'gifs';

        //Cleanup so we don't add this to our query
        if (options) {
            delete options.api;
        }

        if (typeof options === 'object' &&
            Object.keys(options).length !== 0) {
            reqOptions.query = options;
        } else if (typeof options === 'function') {
            callback = options;
        }

        return this._request(reqOptions, callback);
    },

    /**
    * Prepares the HTTP request and query string for the Giphy API
    *
    * @param options
    *   options.endpoint {String} - The API endpoint e.g. search
    *   options.query {String|Object} Query string parameters. If these are left
    *       out then we default to an empty string. If this is passed as a string,
    *       we default to the 'q' query string field used by Giphy.
    */
    _request: function(options, callback) {
        if (!callback && !promisesExist) {
            throw new Error('Callback must be provided if promises are unavailable');
        }

        var endpoint = '';
        if (options.endpoint) {
            endpoint = '/' + options.endpoint;
        }

        endpoint += '?';

        var query;
        var self = this;

        if (typeof options.query !== 'undefined' && typeof options.query === 'object') {
            if (Object.keys(options.query).length === 0) {
                if (callback) {
                    return callback('Options object should not be empty');
                }
                return Promise.reject('Options object should not be empty');
            }

            options.query.api_key = this.apiKey;
            query = queryString.stringify(options.query);
        } else {
            query = queryString.stringify({
                api_key: self.apiKey
            });
        }

        var httpOptions = {
            request: {
                host: API_HOSTNAME,
                path: API_BASE_PATH + options.api + endpoint + query
            },
            https: this.https,
            timeout: this.timeout,
            fmt: options.query && options.query.fmt
        };

        var makeRequest = function(resolve, reject) {
            httpService.get(httpOptions, resolve, reject);
        };

        if (callback) {
            var resolve = function(res) {
                callback(null, res);
            };
            var reject = function(err) {
                callback(err);
            };
            makeRequest(resolve, reject);
        } else {
            if (!promisesExist) {
                throw new Error('Callback must be provided unless Promises are available');
            }
            return new Promise(function(resolve, reject) {
                makeRequest(resolve, reject);
            });
        }
    }
};

module.exports = function(apiKey, options) {
    return new GiphyAPI(apiKey, options);
};

},{"./util/http":5,"querystring":4}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],4:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":2,"./encode":3}],5:[function(require,module,exports){
/* globals XMLHttpRequest */

/**
* Browser based GET request
* @param options {Object}
*   options.request {Object} - Request data including host and path
*   options.https {Boolean} - Whether to utilize HTTPS library for requests or HTTP. Defaults to HTTP.
*   options.timeout {Number} - Request timeout before returning an error. Defaults to 30000 milliseconds
*   options.fmt {String} - Return results in html or json format (useful for viewing responses as GIFs to debug/test)
*/
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

},{}]},{},[1])(1)
});