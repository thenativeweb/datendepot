'use strict';

var fs = require('fs'),
    path = require('path');

var File = function (options) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options) {
    throw new Error('Directory is missing.');
  }

  this.directory = options.directory;
};

File.prototype.get = function (id, callback) {
  var readStream = fs.createReadStream(path.join(this.directory, id));

  readStream.once('error', function (err) {
    readStream.removeAllListeners();
    callback(err);
  });

  readStream.once('open', function () {
    callback(null, readStream);
  });
};

File.prototype.put = function (id, stream, callback) {
  var writeStream = fs.createWriteStream(path.join(this.directory, id));

  writeStream.once('close', function () {
    callback(null, id);
  });

  stream.pipe(writeStream);
};

module.exports = File;
