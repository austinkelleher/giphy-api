giphy-api
===========
[![Build Status](https://travis-ci.org/austinkelleher/giphy-api.svg)](https://travis-ci.org/austinkelleher/giphy-api)
![NPM version](https://badge.fury.io/js/giphy-api.svg)

JavaScript module for the [giphy.com](http://giphy.com) API that
supports **promises and callbacks**. All search parameters and endpoints can be
found on the [Giphy API documentation](https://developers.giphy.com/docs/).

## Installation
```bash
npm install giphy-api --save
```

# Browser build
JavaScript browser bundles are built to `dist/giphy-api.bundle.js` and
`dist/giphy-api.bundle.min.js` using:

```bash
npm run build
```

## Requiring
```javascript
// Require with custom API key
var giphy = require('giphy-api')('API KEY HERE');
// Require with the public beta key
var giphy = require('giphy-api')();
```

## Initialization Options

```javascript
var giphy = require('giphy-api')({
    ...
});
```

- https {Boolean} - Whether to utilize HTTPS library for requests or HTTP. Defaults to HTTP.
- timeout {Number} - Maximum timeout of an API request. Defaults to 30 seconds.
- apiKey {String} - Giphy API key. Defaults to API beta key

## [Phrase search](https://developers.giphy.com/docs/#operation--gifs-search-get)
Search all Giphy GIFs for a word or phrase. Supported parameters:
- q - search query term or phrase
- limit - (optional) number of results to return, maximum 100. Default 25.
- offset - (optional) results offset, defaults to 0.
- rating - limit results to those rated (y,g, pg, pg-13 or r).
- fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)

```javascript
// Search with a plain string using callback
giphy.search('pokemon', function (err, res) {
    // Res contains gif data!
});

// Search with options using promise
giphy.search('pokemon').then(function (res) {
    // Res contains gif data!
});
```
```javascript
// Search with options using callback
giphy.search({
    q: 'pokemon',
    rating: 'g'
}, function (err, res) {
    // Res contains gif data!
});
```

## [Giphy Id search](https://developers.giphy.com/docs/#path--gifs)
Search all Giphy gifs for a single Id or an array of Id's

```javascript
//Search with a single Id using callback
giphy.id('feqkVgjJpYtjy', function (err, res) {

});

//Search with a single Id using promise
giphy.id('feqkVgjJpYtjy').then(function (res) {

});
```
```javascript
// Search with an array of Id's
giphy.id([
    'feqkVgjJpYtjy',
    '7rzbxdu0ZEXLy'
], function (err, res) {

});
```

## [Translate search](https://developers.giphy.com/docs/#path--gifs-translate)
Experimental search endpoint for gif dialects. Supported parameters:
- s - term or phrase to translate into a GIF
- rating - limit results to those rated (y,g, pg, pg-13 or r).
- fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)

```javascript
// Translate search with a plain string using callback
giphy.translate('superman', function (err, res) {

});

// Translate search with a plain string using promise
giphy.translate('superman').then(function (res) {

});
```
```javascript
// Translate search with options
giphy.translate({
    s: 'superman',
    rating: 'g',
    fmt: 'html'
}, function (err, res) {

});
```

## [Random](https://developers.giphy.com/docs/#path--gifs-random)
Random gif(s) filtered by tag. Supported parameters:
- tag - the GIF tag to limit randomness by
- rating - limit results to those rated (y,g, pg, pg-13 or r).
- fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)

```javascript
// Random gif by tag using callback
giphy.random('superman', function (err, res) {

});

// Random gif by tag using promise
giphy.random('superman').then(function (res) {

});
```
```javascript
// Random gif with options
giphy.random({
    tag: 'superman',
    rating: 'g',
    fmt: 'json'
}, function (err, res) {

});
```

## [Trending](https://developers.giphy.com/docs/#path--gifs-trending)
Trending gifs on [The Hot 100](http://giphy.com/hot100) list
- limit (optional) limits the number of results returned. By default returns 25 results.
- rating - limit results to those rated (y,g, pg, pg-13 or r).
- fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)

```javascript
// Trending Hot 100 gifs using callback
giphy.trending(function (err, res) {

});

// Trending Hot 100 gifs using promise
giphy.trending().then(function (res) {

});
```
```javascript
// Trending Hot 100 gifs with options
giphy.trending({
    limit: 2,
    rating: 'g',
    fmt: 'json'
}, function (err, res) {

});
```

## [Stickers](https://developers.giphy.com/docs/#giphy-sticker-api)
[Animated stickers](https://giphy.com/stickers) are gifs with transparent backgrounds. All giphy-api functions
support stickers **except id**, which is not a supported Giphy sticker endpoint.
In order to use the sticker API instead of the gif API, simply pass the ```api```
property to a giphy-api function.
```javascript
// Sticker search using callback
giphy.search({
    api: 'stickers',
    q: 'funny'
}, function (err, res) {

});

// Sticker search using promise
giphy.search({
    api: 'stickers',
    q: 'funny'
}).then(res) {

});
```
