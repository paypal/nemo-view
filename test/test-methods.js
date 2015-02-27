/* global describe,beforeEach,it */
'use strict';

var assert = require('assert'),
  nemoFactory = require('nemo-mocha-factory'),
  plugins = require('./plugins'),
  nemo = {},
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  setup = {
    'view': ['simple']
  };

describe('nemo-view @methods@', function () {
  nemoFactory({
    'context': nemo,
    'plugins': plugins,
    'setup': setup
  });

  beforeEach(function (done) {
    nemo.driver.get(nemo.props.targetBaseUrl);
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
  it('should appropriately use a timeout argument to the @Wait@CustomTimeout@ method in a failure scenario', function (done) {
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
  it('should appropriately use a DIFFERENT timeout argument to the @Wait@CustomTimeout@ method in a failure scenario', function (done) {
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
    nemo.driver.get(nemo.props.targetBaseUrl + '/waits');
    util.waitForJSReady(nemo);
    nemo.view.simple.waitButton().click();
    nemo.view.simple.outBoxWaitVisible(6000, 'didnt find outbox').getTagName().then(function (tn) {
      console.log('tn', tn);
      assert.equal(tn.toLowerCase(), 'div');
      done();
    }, util.doneError(done));
  });
  it('should use @WaitVisible@negative@ method in negative scenario', function (done) {

    var start;
    nemo.driver.get(nemo.props.targetBaseUrl + '/waits');
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
  it('should find an existing element using the @Wait@ElementExists@ method', function (done) {
    nemo.view.simple.bodyTagWait(3000, 'didn\t find body tag').then(function (found) {
      if (found === true) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
});