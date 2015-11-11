/* global process */

var http = require('http');
var queryString = require('querystring');

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
* Define if the environment is a browser
*/
var ENV_IS_BROWSER = process.browser || false;

/**
* @param apiKey Giphy API key. Defaults to the public beta API key
*/
var GiphyAPI = function(apiKey) {
    this.apiKey = apiKey || PUBLIC_BETA_API_KEY;
};

GiphyAPI.prototype = {
    /**
    * Search all Giphy gifs by word or phrase
    *
    * @param options Giphy API search options
    *   q - search query term or phrase
    *   limit - (optional) number of results to return, maximum 100. Default 25.
    *   offset - (optional) results offset, defaults to 0.
    *   rating - limit results to those rated (y,g, pg, pg-13 or r).
    *   fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
    * @param callback
    */
    search: function(options, callback) {
        if (!options) {
            if (callback) {
                return callback('Search phrase cannot be empty.');
            } else {
                return Promise.reject('Search phrase cannot be empty.');
            }
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
    * @param id Single Giphy gif string Id or array of string Id's
    * @param callback
    */
    id: function(id, callback) {
        var idIsArr = Array.isArray(id);

        if (!id || (idIsArr && id.length === 0)) {
            if (callback) {
                return callback('Id required for id API call');
            } else {
                return Promise.reject('Id required for id API call');
            }
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
    *   s - term or phrase to translate into a GIF
    *   rating - limit results to those rated (y,g, pg, pg-13 or r).
    *   fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
    */
    translate: function(options, callback) {
        if (!options) {
            if (callback) {
                return callback('Translate phrase cannot be empty.');
            } else {
                return new Promise.reject('Translate phrase cannot be empty.');
            }
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
    *   tag - the GIF tag to limit randomness by
    *   rating - limit results to those rated (y,g, pg, pg-13 or r).
    *   fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
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
    *   limit (optional) limits the number of results returned. By default returns 25 results.
    *   rating - limit results to those rated (y,g, pg, pg-13 or r).
    *   fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
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
    *   - endpoint {{string}} The API endpoint e.g. search
    *   - query {{string/object}} Query string parameters. If these are left
    *   out then we default to an empty string. If this is passed as a string,
    *   we default to the 'q' query string field used by Giphy.
    */
    _request: function(options, callback) {
        var endpoint = '';
        if (options.endpoint) {
            endpoint = '/' + options.endpoint;
        }

        endpoint += '?';

        var query;
        var self = this;

        if (typeof(options.query) !== 'undefined') {
            if (typeof(options.query) === 'object') {
                if (Object.keys(options.query).length === 0) {
                    if (callback) {
                        return callback('Options object should not be empty');
                    }
                    return Promise.reject('Options object should not be empty');
                }

                options.query.api_key = this.apiKey;
                query = queryString.stringify(options.query);
            }
        } else {
            query = queryString.stringify({
                api_key: self.apiKey
            });
        }

        var requestOptions = {
            hostname: API_HOSTNAME,
            path: API_BASE_PATH + options.api + endpoint + query,
            withCredentials: !ENV_IS_BROWSER
        };

        var makeRequest = function(resolve, reject) {
            http.get(requestOptions, function(response) {
                var body = '';
                response.on('data', function(d) {
                    body += d;
                });
                response.on('end', function() {
                    if (!options.query || options.query.fmt !== 'html') {
                        body = JSON.parse(body);
                    }
                    resolve(body);
                });
            }).on('error', function(err) {
                reject(err);
            });
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
            if (typeof Promise === 'undefined') {
                throw new Error('Callback must be provided unless Promises are available');
            }
            return new Promise(function(resolve, reject) {
                makeRequest(resolve, reject);
            });
        }
    }
};

module.exports = function(apiKey) {
    return new GiphyAPI(apiKey);
};
