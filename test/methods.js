/* global describe,beforeEach,it */
'use strict';

var assert = require('assert'),
  nemo,
  _ = require('lodash'),
  Nemo = require('nemo'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @methods@whitelist@', function () {
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
  it('should return a @locatorObject@', function (done) {
    var locator = nemo.view.simple.outBoxBy();
    if (locator.using && locator.value) {
      done();
    } else {
      done(new Error('didnt get back a locator object'));
    }

  });
  it('should find an existing element using the @Wait@positive@ method', function (done) {
    nemo.view.simple.bodyTagWait(3000, 'didnt find body tag').getTagName().then(function (tn) {
      if (tn.toLowerCase() === 'body') {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should appropriately use a timeout argument to the @Wait@negative@CustomTimeout@ method in a failure scenario', function (done) {
    var start = Date.now();
    nemo.view.simple.notExistWait(13000, 'didnt find notExist').then(function (find) {
      done(new Error('found notExist but should not have'));
    }, function (err) {
      var found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 13800 || found < 12500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });

  });
  it('should appropriately use a DIFFERENT timeout argument to the @Wait@negative@CustomTimeout@ method in a failure scenario', function (done) {
    var start = Date.now();
    nemo.view.simple.notExistWait(3000, 'didnt find notExist').then(function (find) {
      done(new Error('found notExist but should not have'));
    }, function (err) {
      var found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });
  it('should use @WaitVisible@positive@ method', function (done) {
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo);
    nemo.view.simple.waitButton().click();
    nemo.view.simple.outBoxWaitVisible(6000, 'didnt find outbox').getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
      done();
    }, util.doneError(done));
  });
  it('should use @WaitVisible@negative@ method in negative scenario', function (done) {

    var start;
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    nemo.view.simple.outBoxWaitVisible(3000, 'didnt find outbox').then(function (find) {
      done(new Error('shouldn\'t have found the element to be visible'));
    }, function (err) {
      var found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });
  it('should return true using @Present@Positive@ method', function (done) {
    nemo.view.simple.outBoxPresent().then(function (present) {
      assert.equal(present, true);
      done();
    }, util.doneError(done));
  });
  it('should return false using @Present@negative@ method', function (done) {
    nemo.view.simple.notExistPresent().then(function (present) {
      assert.equal(present, false);
      done();
    }, util.doneError(done));
  });
});