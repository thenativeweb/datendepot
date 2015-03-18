'use strict';

var path = require('path');

var assert = require('assertthat'),
    formats = require('formats'),
    isolated = require('isolated'),
    request = require('supertest');

var datendepot = require('../lib/datendepot');

suite('datendepot', function () {
  test('is a function.', function (done) {
    assert.that(datendepot).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', function (done) {
    assert.that(function () {
      datendepot();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if storage is missing.', function (done) {
    assert.that(function () {
      datendepot({});
    }).is.throwing('Storage is missing.');
    done();
  });

  test('throws an error if an unknown storage is given.', function (done) {
    assert.that(function () {
      datendepot({
        storage: 'foobar'
      });
    }).is.throwing('Unknown storage.');
    done();
  });

  test('throws an error if storage options are missing.', function (done) {
    assert.that(function () {
      datendepot({
        storage: 'File'
      });
    }).is.throwing('Storage options are missing.');
    done();
  });

  test('returns a function.', function (done) {
    assert.that(datendepot({
      storage: 'File',
      options: {
        directory: '/'
      }
    })).is.ofType('function');
    done();
  });

  suite('middleware', function () {
    suite('GET /<id>', function () {
      test('returns a 404 if the id is missing.', function (done) {
        isolated(function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .get('/')
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.statusCode).is.equalTo(404);
              done();
            });
        });
      });

      test('returns a 404 if the given id does not exist.', function (done) {
        isolated(function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .get('/c572bcd4-f68f-4940-a94c-c6b3587dfcf2')
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.statusCode).is.equalTo(404);
              done();
            });
        });
      });

      test('returns a 200 if the id exists.', function (done) {
        var id = 'c572bcd4-f68f-4940-a94c-c6b3587dfcf2';

        isolated(path.join(__dirname, 'storage', 'data', id), function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .get('/c572bcd4-f68f-4940-a94c-c6b3587dfcf2')
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.statusCode).is.equalTo(200);
              done();
            });
        });
      });

      test('returns the data for a given id.', function (done) {
        var id = 'c572bcd4-f68f-4940-a94c-c6b3587dfcf2';

        isolated(path.join(__dirname, 'storage', 'data', id), function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .get('/c572bcd4-f68f-4940-a94c-c6b3587dfcf2')
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.text).is.equalTo('foobar\n');
              done();
            });
        });
      });

      test('returns application/octet-stream for data of an unknown type.', function (done) {
        var id = 'c572bcd4-f68f-4940-a94c-c6b3587dfcf2';

        isolated(path.join(__dirname, 'storage', 'data', id), function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .get('/c572bcd4-f68f-4940-a94c-c6b3587dfcf2')
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.headers['content-type']).is.equalTo('application/octet-stream');
              done();
            });
        });
      });

      test('returns the appropriate mime type for a known type.', function (done) {
        var id = '932104d2-9929-40b4-8f3c-47912314da0d';

        isolated(path.join(__dirname, 'storage', 'data', id), function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .get('/' + id)
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.headers['content-type']).is.equalTo('image/png');
              done();
            });
        });
      });
    });

    suite('POST /', function () {
      test('returns a 200 if the data was written.', function (done) {
        isolated(function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .post('/')
            .send('foobar')
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.statusCode).is.equalTo(200);
              done();
            });
        });
      });

      test('returns an id if the data was written.', function (done) {
        isolated(function (errIsolated, directory) {
          var middleware;

          assert.that(errIsolated).is.null();
          middleware = datendepot({
            storage: 'File',
            options: {
              directory: directory
            }
          });

          request(middleware)
            .post('/')
            .send('foobar')
            .end(function (err, res) {
              assert.that(err).is.null();
              assert.that(res.body).is.ofType('object');
              assert.that(formats.isUuid(res.body.id)).is.true();
              done();
            });
        });
      });
    });
  });
});
