/**
 * Using .exist as a property instead of a function makes jshint unhappy!
 */
var Giphy = require('../');
var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var http = require('http');
var https = require('https');
var EventEmitter = require('events').EventEmitter;

var promisesExist = typeof Promise !== 'undefined';

describe('Giphy API', function () {
  var giphy = new Giphy();

  describe('The callback based api', function () {
    describe('Giphy Phrase Search', function () {
      it('should allow user to search by phrase without space', function (done) {
        giphy.search({
          q: 'funny'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to search with phrase with space', function (done) {
        giphy.search({
          q: 'funny cat'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to search with all Giphy search parameters', function (done) {
        giphy.search({
          q: 'funny cat',
          limit: 5,
          offset: 2,
          rating: 'g',
          fmt: 'json'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data.length).to.equal(5);
          done();
        });
      });

      it('should allow format to be HTML', function (done) {
        giphy.search({
          q: 'funny cat',
          limit: 5,
          offset: 2,
          rating: 'g',
          fmt: 'html'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res).to.exist;
          done();
        });
      });

      it('should be able to search by string', function (done) {
        giphy.search('funny cat', function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should receive error with empty string option', function (done) {
        giphy.search('', function (err, res) {
          expect(err).to.exist;
          done();
        });
      });

      it('should receive error with empty object option', function (done) {
        giphy.search({}, function (err, res) {
          expect(err).to.exist;
          done();
        });
      });
    });

    describe('Giphy Id Search', function () {
      it('should allow user to search by id', function (done) {
        giphy.id('feqkVgjJpYtjy', function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to search by array of Ids', function (done) {
        giphy.id([
          'feqkVgjJpYtjy',
          '7rzbxdu0ZEXLy'
        ], function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should throw error if Id string empty', function (done) {
        giphy.id('', function (err, res) {
          expect(err).to.exist;
          done();
        });
      });

      it('should throw error if Id array empty', function (done) {
        giphy.id([], function (err, res) {
          expect(err).to.exist;
          done();
        });
      });
    });

    describe('Giphy Translate', function () {
      it('should allow user to translate by phrase as string', function (done) {
        giphy.translate('superman', function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to translate by phrase as object', function (done) {
        giphy.translate({
          s: 'superman'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to translate with phrase with space', function (done) {
        giphy.translate({
          s: 'funny superman'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to translate with all Giphy translate parameters', function (done) {
        giphy.translate({
          s: 'superman',
          rating: 'g',
          fmt: 'json'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });
    });

    describe('Giphy Random', function () {
      it('should allow user to receive a random gif by string without space', function (done) {
        giphy.random('superman', function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive a random gif without a query', function (done) {
        giphy.random(function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive a random gif with a query that does not include tag', function (done) {
        giphy.random({
          rating: 'g'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive a random gif by string with space', function (done) {
        giphy.random('funny superman', function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive a random gif with tag property', function (done) {
        giphy.random({
          tag: 'superman'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive a random gif with all parameters', function (done) {
        giphy.random({
          tag: 'superman',
          rating: 'g',
          fmt: 'json'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });
    });

    describe('Giphy Trending', function () {
      it('should allow user to receive trending gifs without options', function (done) {
        giphy.trending(function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow empty options object to be passed', function (done) {
        giphy.trending({}, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive trending gifs with all options', function (done) {
        giphy.trending({
          limit: 2,
          rating: 'g',
          fmt: 'json'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data.length).to.equal(2);
          done();
        });
      });
    });

    describe('Giphy Stickers', function () {
      it('should allow user to receive search stickers', function (done) {
        giphy.search({
          api: 'stickers',
          q: 'funny'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive translate stickers', function (done) {
        giphy.translate({
          api: 'stickers',
          s: 'superman'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive random stickers', function (done) {
        giphy.random({
          api: 'stickers',
          tag: 'superman'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });

      it('should allow user to receive trending stickers', function (done) {
        giphy.trending({
          api: 'stickers'
        }, function (err, res) {
          expect(err).to.equal(null);
          expect(res.data).to.not.be.empty;
          done();
        });
      });
    });
  });

  describe('Unsupported promise engine errors', function () {
    if (promisesExist) {
      return;
    }

    describe('Giphy Phrase Search', function () {
      it('should throw error if no options passed', function () {
        var test = function () {
          giphy.search();
        };

        expect(test).to.throw(Error);
      });

      it('should throw error if options passed without callback', function () {
        var test = function () {
          giphy.search({
            q: 'funny'
          });
        };

        expect(test).to.throw(Error);
      });
    });

    describe('Giphy Id Search', function () {
      it('should throw error if no options passed', function () {
        var test = function () {
          giphy.id();
        };

        expect(test).to.throw(Error);
      });

      it('should throw error if options passed without callback', function () {
        var test = function () {
          giphy.id('feqkVgjJpYtjy');
        };

        expect(test).to.throw(Error);
      });
    });

    describe('Giphy Translate', function () {
      it('should throw error if no options passed', function () {
        var test = function () {
          giphy.translate();
        };

        expect(test).to.throw(Error);
      });

      it('should throw error if options passed without callback', function () {
        var test = function () {
          giphy.translate({
            s: 'superman'
          });
        };

        expect(test).to.throw(Error);
      });
    });
  });

  describe('The promise based api', function () {
    if (!promisesExist) {
      return;
    }
    describe('Giphy Phrase Search', function () {
      it('should allow user to search by phrase without space', function () {
        return giphy.search({
          q: 'funny'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to search with phrase with space', function () {
        return giphy.search({
          q: 'funny cat'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to search with all Giphy search parameters', function () {
        return giphy.search({
          q: 'funny cat',
          limit: 5,
          offset: 2,
          rating: 'g',
          fmt: 'json'
        }).then(function (res) {
          expect(res.data.length).to.equal(5);
        });
      });

      it('should allow format to be HTML', function () {
        return giphy.search({
          q: 'funny cat',
          limit: 5,
          offset: 2,
          rating: 'g',
          fmt: 'html'
        }).then(function (res) {
          expect(res).to.exist;
        });
      });

      it('should be able to search by string', function () {
        return giphy.search('funny cat').then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should receive error with empty string option', function () {
        return giphy.search('').catch(function (err) {
          expect(err).to.exist;
        });
      });

      it('should receive error with empty object option', function () {
        return giphy.search({}).catch(function (err) {
          expect(err).to.exist;
        });
      });
    });

    describe('Giphy Id Search', function () {
      it('should allow user to search by id', function () {
        return giphy.id('feqkVgjJpYtjy').then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to search by array of Ids', function () {
        return giphy.id([
          'feqkVgjJpYtjy',
          '7rzbxdu0ZEXLy'
        ]).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should throw error if Id string empty', function () {
        return giphy.id('').catch(function (err) {
          expect(err).to.exist;
        });
      });

      it('should throw error if Id array empty', function () {
        return giphy.id([]).catch(function (err, res) {
          expect(err).to.exist;
        });
      });
    });

    describe('Giphy Translate', function () {
      it('should allow user to translate by phrase as string', function () {
        return giphy.translate('superman').then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to translate by phrase as object', function () {
        return giphy.translate({
          s: 'superman'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to translate with phrase with space', function () {
        return giphy.translate({
          s: 'funny superman'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to translate with all Giphy translate parameters', function () {
        return giphy.translate({
          s: 'superman',
          rating: 'g',
          fmt: 'json'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });
    });

    describe('Giphy Random', function () {
      it('should allow user to receive a random gif by string without space', function () {
        return giphy.random('superman').then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive a random gif without a query', function () {
        return giphy.random().then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive a random gif with a query that does not include tag', function () {
        return giphy.random({
          rating: 'g'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive a random gif by string with space', function () {
        return giphy.random('funny superman').then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive a random gif with tag property', function () {
        return giphy.random({
          tag: 'superman'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive a random gif with all parameters', function () {
        return giphy.random({
          tag: 'superman',
          rating: 'g',
          fmt: 'json'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });
    });

    describe('Giphy Trending', function () {
      it('should allow user to receive trending gifs without options', function () {
        return giphy.trending().then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow empty options object to be passed', function () {
        return giphy.trending({}).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive trending gifs with all options', function () {
        return giphy.trending({
          limit: 2,
          rating: 'g',
          fmt: 'json'
        }).then(function (res) {
          expect(res.data.length).to.equal(2);
        });
      });
    });

    describe('Giphy Stickers', function () {
      it('should allow user to receive search stickers', function () {
        return giphy.search({
          api: 'stickers',
          q: 'funny'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive translate stickers', function () {
        return giphy.translate({
          api: 'stickers',
          s: 'superman'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive random stickers', function () {
        return giphy.random({
          api: 'stickers',
          tag: 'superman'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });

      it('should allow user to receive trending stickers', function () {
        return giphy.trending({
          api: 'stickers'
        }).then(function (res) {
          expect(res.data).to.not.be.empty;
        });
      });
    });
  });

  describe('Initialization', function () {
    it('should allow initializing with no arguments', function (done) {
      var giphy = new Giphy();
      giphy.search({
        q: 'funny'
      }, function (err, res) {
        expect(err).to.equal(null);
        expect(res.data).to.not.be.empty;
        done();
      });
    });

    it('should allow initializing with null argument', function (done) {
      var giphy = new Giphy(null);
      giphy.search({
        q: 'funny'
      }, function (err, res) {
        expect(err).to.equal(null);
        expect(res.data).to.not.be.empty;
        done();
      });
    });

    it('should allow initializing with api key string', function (done) {
      // Use the public beta API key
      var giphy = new Giphy('dc6zaTOxFJmzC');
      giphy.search({
        q: 'funny'
      }, function (err, res) {
        expect(err).to.equal(null);
        expect(res.data).to.not.be.empty;
        done();
      });
    });

    it('should allow initializing with arguments with api key', function (done) {
      // Use the public beta API key
      var giphy = new Giphy({
        apiKey: 'dc6zaTOxFJmzC'
      });

      giphy.search({
        q: 'funny'
      }, function (err, res) {
        expect(err).to.equal(null);
        expect(res.data).to.not.be.empty;
        done();
      });
    });

    it('should allow initializing with no api key', function (done) {
      var giphy = new Giphy({
        timeout: 5000
      });

      giphy.search({
        q: 'funny'
      }, function (err, res) {
        expect(err).to.equal(null);
        expect(res.data).to.not.be.empty;
        done();
      });
    });

    it('should allow initializing with empty object', function (done) {
      var giphy = new Giphy({});

      giphy.search({
        q: 'funny'
      }, function (err, res) {
        expect(err).to.equal(null);
        expect(res.data).to.not.be.empty;
        done();
      });
    });

    it('should initialize with httpService as http by default', function () {
      var giphy = new Giphy();
      expect(giphy.httpService.globalAgent.protocol).to.equal('http:');
    });

    it('should initialize with httpService as https when enabled', function () {
      var giphy = new Giphy({ https: true });
      expect(giphy.httpService.globalAgent.protocol).to.equal('https:');
    });
  });

  describe('HTTP/HTTPS', function () {
    beforeEach(function () {
      sinon.stub(http, 'get').returns(new EventEmitter());
      sinon.stub(https, 'get').returns(new EventEmitter());
    });

    afterEach(function () {
      http.get.restore();
      https.get.restore();
    });

    it('defaults to http', function () {
      var giphy = new Giphy({});
      giphy.search({
        q: 'foo'
      }, function () {});
      sinon.assert.calledOnce(http.get);
      sinon.assert.notCalled(https.get);
    });

    it('uses https when configured', function () {
      var giphy = new Giphy({
        https: true
      });
      giphy.search({
        q: 'foo'
      }, function () {});
      sinon.assert.notCalled(http.get);
      sinon.assert.calledOnce(https.get);
    });
  });
});
