(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GiphyAPI = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var queryStringify = require('./util/queryStringify');
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
function _handleErr (err, callback) {
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
var GiphyAPI = function (options) {
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
  this.httpService = httpService.create(this.https);
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
  search: function (options, callback) {
    if (!options) {
      return _handleErr('Search phrase cannot be empty.', callback);
    }

    return this._request({
      api: options.api || 'gifs',
      endpoint: 'search',
      query: typeof options === 'string' ? {
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
  id: function (id, callback) {
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
  translate: function (options, callback) {
    if (!options) {
      return _handleErr('Translate phrase cannot be empty.', callback);
    }

    return this._request({
      api: options.api || 'gifs',
      endpoint: 'translate',
      query: typeof options === 'string' ? {
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
  random: function (options, callback) {
    var reqOptions = {
      api: (options ? options.api : null) || 'gifs',
      endpoint: 'random'
    };

    if (typeof options === 'string') {
      reqOptions.query = {
        tag: options
      };
    } else if (typeof options === 'object') {
      reqOptions.query = options;
    } else if (typeof options === 'function') {
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
  trending: function (options, callback) {
    var reqOptions = {
      endpoint: 'trending'
    };

    reqOptions.api = (options ? options.api : null) || 'gifs';

    // Cleanup so we don't add this to our query
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
  _request: function (options, callback) {
    if (!callback && !promisesExist) {
      throw new Error('Callback must be provided if promises are unavailable');
    }

    var endpoint = '';
    if (options.endpoint) {
      endpoint = '/' + options.endpoint;
    }

    var query;
    var self = this;

    if (typeof options.query !== 'undefined' && typeof options.query === 'object') {
      if (Object.keys(options.query).length === 0) {
        if (callback) {
          return callback(new Error('Options object should not be empty'));
        }
        return Promise.reject(new Error('Options object should not be empty'));
      }

      options.query.api_key = this.apiKey;
      query = queryStringify(options.query);
    } else {
      query = queryStringify({
        api_key: self.apiKey
      });
    }

    var httpOptions = {
      httpService: this.httpService,
      request: {
        host: API_HOSTNAME,
        path: API_BASE_PATH + options.api + endpoint + query
      },
      timeout: this.timeout,
      fmt: options.query && options.query.fmt,
      https: this.https
    };

    var makeRequest = function (resolve, reject) {
      httpService.get(httpOptions, resolve, reject);
    };

    if (callback) {
      var resolve = function (res) {
        callback(null, res);
      };
      var reject = function (err) {
        callback(err);
      };
      makeRequest(resolve, reject);
    } else {
      if (!promisesExist) {
        throw new Error('Callback must be provided unless Promises are available');
      }
      return new Promise(function (resolve, reject) {
        makeRequest(resolve, reject);
      });
    }
  }
};

module.exports = function (apiKey, options) {
  return new GiphyAPI(apiKey, options);
};

},{"./util/http":2,"./util/queryStringify":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
// Adapted with small modifications from: https://github.com/unshiftio/querystringify/blob/master/index.js
var has = Object.prototype.hasOwnProperty;

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
module.exports = function (obj) {
  var pairs = [];

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? '?' + pairs.join('&') : '';
};

},{}]},{},[1])(1)
});
