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
