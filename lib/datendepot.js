'use strict';

var path = require('path');

var express = require('express'),
    fileType = require('file-type'),
    formats = require('formats'),
    requireAll = require('require-all'),
    uuid = require('uuidv4');

var storages = requireAll(path.join(__dirname, 'storage'));

var datendepot = function (options) {
  var middleware,
      storage;

  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.storage) {
    throw new Error('Storage is missing.');
  }
  if (!storages[options.storage]) {
    throw new Error('Unknown storage.');
  }
  if (!options.options) {
    throw new Error('Storage options are missing.');
  }

  storage = new storages[options.storage](options.options);

  middleware = express();

  middleware.get('/:id', function (req, res) {
    if (!formats.isUuid(req.params.id)) {
      return res.sendStatus(400);
    }

    storage.get(req.params.id, function (err, stream) {
      if (err) {
        return res.sendStatus(404);
      }

      stream.once('data', function (data) {
        var contentType = 'application/octet-stream',
            type = fileType(data);

        if (type) {
          contentType = type.mime;
        }

        res.writeHead(200, {
          'content-type': contentType
        });
      });

      stream.pipe(res);
    });
  });

  middleware.post('/', function (req, res) {
    var id = uuid();

    storage.put(id, req, function (err) {
      if (err) {
        return res.sendStatus(500);
      }
      res.send({
        id: id
      });
    });
  });

  return middleware;
};

module.exports = datendepot;
