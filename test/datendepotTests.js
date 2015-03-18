'use strict';

var assert = require('assertthat');

var datendepot = require('../lib/datendepot');

suite('datendepot', function () {
  test('is a function.', function (done) {
    assert.that(datendepot).is.ofType('function');
    done();
  });
});
