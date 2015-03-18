'use strict';

var fs = require('fs'),
    path = require('path');

var File = function (options) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.directory) {
    throw new Error('Directory is missing.');
  }

  this.directory = options.directory;
};

File.prototype.get = function (id, callback) {
  var readStream;

  if (!id) {
    throw new Error('Id is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  readStream = fs.createReadStream(path.join(this.directory, id));

  readStream.once('error', function (err) {
    readStream.removeAllListeners();
    callback(err);
  });

  readStream.once('open', function () {
    callback(null, readStream);
  });
};

File.prototype.put = function (id, stream, callback) {
  var writeStream;

  if (!id) {
    throw new Error('Id is missing.');
  }
  if (!stream) {
    throw new Error('Stream is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  writeStream = fs.createWriteStream(path.join(this.directory, id));

  writeStream.once('close', function () {
    callback(null);
  });

  stream.pipe(writeStream);
};

module.exports = File;
