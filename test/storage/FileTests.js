'use strict';

var fs = require('fs'),
    path = require('path'),
    stream = require('stream');

var assert = require('assertthat'),
    isolated = require('isolated'),
    uuid = require('uuidv4');

var File = require('../../lib/storage/File');

var PassThrough = stream.PassThrough;

suite('File', function () {
  test('is a function.', function (done) {
    assert.that(File).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', function (done) {
    assert.that(function () {
      /*eslint-disable no-new*/
      new File();
      /*eslint-enable no-new*/
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if directory is missing.', function (done) {
    assert.that(function () {
      /*eslint-disable no-new*/
      new File({});
      /*eslint-enable no-new*/
    }).is.throwing('Directory is missing.');
    done();
  });

  test('returns an object.', function (done) {
    var storage = new File({
      directory: '/'
    });

    assert.that(storage).is.ofType('object');
    done();
  });

  suite('storage', function () {
    suite('put', function () {
      test('is a function.', function (done) {
        var storage = new File({
          directory: '/'
        });

        assert.that(storage.put).is.ofType('function');
        done();
      });

      test('throws an error if the id is missing.', function (done) {
        var storage = new File({
          directory: '/'
        });

        assert.that(function () {
          storage.put();
        }).is.throwing('Id is missing.');
        done();
      });

      test('throws an error if the stream is missing.', function (done) {
        var storage = new File({
          directory: '/'
        });

        assert.that(function () {
          storage.put(uuid());
        }).is.throwing('Stream is missing.');
        done();
      });

      test('throws an error if the callback is missing.', function (done) {
        var storage = new File({
          directory: '/'
        });

        assert.that(function () {
          storage.put(uuid(), new PassThrough());
        }).is.throwing('Callback is missing.');
        done();
      });

      test('writes the given stream using the given id.', function (done) {
        isolated(function (errIsolated, directory) {
          var id,
              passThrough,
              storage;

          assert.that(errIsolated).is.null();
          passThrough = new PassThrough();
          storage = new File({
            directory: directory
          });

          id = uuid();
          storage.put(id, passThrough, function (err) {
            assert.that(err).is.null();
            assert.that(fs.readFileSync(path.join(directory, id), {
              encoding: 'utf8'
            })).is.equalTo('foobar');
            done();
          });

          passThrough.write('foobar');
          passThrough.end();
        });
      });
    });

    suite('get', function () {
      test('is a function.', function (done) {
        var storage = new File({
          directory: '/'
        });

        assert.that(storage.get).is.ofType('function');
        done();
      });

      test('throws an error if the id is missing.', function (done) {
        var storage = new File({
          directory: '/'
        });

        assert.that(function () {
          storage.get();
        }).is.throwing('Id is missing.');
        done();
      });

      test('throws an error if the callback is missing.', function (done) {
        var storage = new File({
          directory: '/'
        });

        assert.that(function () {
          storage.get(uuid());
        }).is.throwing('Callback is missing.');
        done();
      });

      test('returns the data stream for the given id.', function (done) {
        var id = 'c572bcd4-f68f-4940-a94c-c6b3587dfcf2';

        isolated(path.join(__dirname, 'data', id), function (errIsolated, directory) {
          var storage;

          assert.that(errIsolated).is.null();

          storage = new File({
            directory: directory
          });

          storage.get(id, function (err, readStream) {
            var result = '';

            assert.that(err).is.null();

            readStream.on('data', function (data) {
              result += data;
            });

            readStream.once('end', function () {
              assert.that(result).is.equalTo('foobar\n');
              readStream.removeAllListeners();
              done();
            });
          });
        });
      });

      test('returns an error if the given id is not found.', function (done) {
        var id = 'c572bcd4-f68f-4940-a94c-c6b3587dfcf2';

        isolated(function (errIsolated, directory) {
          var storage;

          assert.that(errIsolated).is.null();

          storage = new File({
            directory: directory
          });

          storage.get(id, function (err) {
            assert.that(err).is.not.null();
            done();
          });
        });
      });
    });
  });
});
