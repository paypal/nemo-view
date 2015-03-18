/* global describe,beforeEach,it */
'use strict';

var Nemo = require('nemo'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  assert = require('assert'),
  nemo = {};

describe('nemo-view @verySimple@whitelist@', function () {
  process.env.nemoBaseDir='/Users/medelman/src/n/o/nemo-view/test';
  before(function(done) {
    nemo = Nemo(done);
  });
  after(function(done) {
    nemo.driver.quit().then(function() {
      done();
    });
  });

  beforeEach(function (done) {
    nemo.driver.get(nemo.data.baseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });
  it('should use the form view to enter values and write to outy div @useView@', function (done) {
    nemo.view.simple.outBox().getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
      done();
    }, util.doneError(done));
  });
});