/**
* Using .exist as a property instead of a function makes jshint unhappy!
*/
/*jshint -W030 */
var giphy = require('../')();
var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

describe('Giphy API', function() {

    describe('Giphy Phrase Search', function() {
        it('should allow user to search by phrase without space', function(done) {
            giphy.search({
                q: 'funny'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to search with phrase with space', function(done) {
            giphy.search({
                q: 'funny cat'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to search with all Giphy search parameters', function(done) {
            giphy.search({
                q: 'funny cat',
                limit: 5,
                offset: 2,
                rating: 'g',
                fmt: 'json'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data.length).to.equal(5);
                done();
            });
        });

        it('should allow format to be HTML', function(done) {
            giphy.search({
                q: 'funny cat',
                limit: 5,
                offset: 2,
                rating: 'g',
                fmt: 'html'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res).to.exist;
                done();
            });
        });

        it('should be able to search by string', function(done) {
            giphy.search('funny cat', function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should receive error with empty string option', function(done) {
            giphy.search('', function(err, res) {
                expect(err).to.exist;
                done();
            });
        });

        it('should receive error with empty object option', function(done) {
            giphy.search({}, function(err, res) {
                expect(err).to.exist;
                done();
            });
        });
    });

    describe('Giphy Id Search', function() {

        it('should allow user to search by id', function(done) {
            giphy.id('feqkVgjJpYtjy', function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to search by array of Ids', function(done) {
            giphy.id([
                'feqkVgjJpYtjy',
                '7rzbxdu0ZEXLy'
            ], function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should throw error if Id string empty', function(done) {
            giphy.id('', function(err, res) {
                expect(err).to.exist;
                done();
            });
        });

        it('should throw error if Id array empty', function(done) {
            giphy.id([], function(err, res) {
                expect(err).to.exist;
                done();
            });
        });
    });

    describe('Giphy Translate', function() {

        it('should allow user to translate by phrase as string', function(done) {
            giphy.translate('superman', function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to translate by phrase as object', function(done) {
            giphy.translate({
                s: 'superman'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to translate with phrase with space', function(done) {
            giphy.translate({
                s: 'funny superman'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to translate with all Giphy translate parameters', function(done) {
            giphy.translate({
                s: 'superman',
                rating: 'g',
                fmt: 'json'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });
    });

    describe('Giphy Random', function() {

        it('should allow user to receive a random gif by string without space', function(done) {
            giphy.random('superman', function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to receive a random gif by string with space', function(done) {
            giphy.random('funny superman', function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to receive a random gif with tag property', function(done) {
            giphy.random({
                tag: 'superman'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to receive a random gif with all parameters', function(done) {
            giphy.random({
                tag: 'superman',
                rating: 'g',
                fmt: 'json'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });
    });

    describe('Giphy Trending', function() {

        it('should allow user to receive trending gifs without options', function(done) {
            giphy.trending(function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow empty options object to be passed', function(done) {
            giphy.trending({}, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to receive trending gifs with all options', function(done) {
            giphy.trending({
                limit: 2,
                rating: 'g',
                fmt: 'json'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data.length).to.equal(2);
                done();
            });
        });

        it('should receive error if no callback provided', function(done) {
            try {
                giphy.trending('test');
            } catch(e) {
                expect(e).to.exist;
                done();
            }
        });
    });

    describe('Giphy Stickers', function() {
        it('should allow user to receive search stickers', function(done) {
            giphy.search({
                api: 'stickers',
                q: 'funny'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to receive translate stickers', function(done) {
            giphy.translate({
                api: 'stickers',
                s: 'superman'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to receive random stickers', function(done) {
            giphy.random({
                api: 'stickers',
                tag: 'superman'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });

        it('should allow user to receive trending stickers', function(done) {
            giphy.trending({
                api: 'stickers'
            }, function(err, res) {
                expect(err).to.equal(null);
                expect(res.data).to.not.be.empty;
                done();
            });
        });
    });
});
