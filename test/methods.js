/* global describe,before,after,beforeEach,it */
'use strict';

var assert = require('assert'),
  nemo,
  Nemo = require('nemo'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @methods@', function () {
  before(function (done) {
    nemo = Nemo(done);
  });
  after(function (done) {
    nemo.driver.quit().then(done);
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
  it('should use @WaitVisible@negative@ method for element present but not visible', function (done) {

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
  it('should use @WaitVisible@negative@ method for element not present ', function (done) {

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

  //GENERIC methods
  it('should find an existing element using the @_wait@positive@ method', function (done) {
    nemo.view._wait('body', 3000, 'Element did not load for specified timeout').getTagName().then(function (tn) {
      if (tn.toLowerCase() === 'body') {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should appropriately use a timeout argument to the @_wait@negative@CustomTimeout@ method in a failure scenario', function (done) {
    var start = Date.now();
    nemo.view._wait('bordy.foo.blarg', 13000, 'Element did not load for specified timeout').then(function (find) {
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
  it('should appropriately use a DIFFERENT timeout argument to the @_wait@negative@CustomTimeout@ method in a failure scenario', function (done) {
    var start = Date.now();
    nemo.view._wait('bordy.foo.blarg', 3000, 'Element did not load for specified timeout').then(function (find) {
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
  it('should use @_waitVisible@positive@ method', function (done) {
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo);
    nemo.view.simple.waitButton().click();
    nemo.view._waitVisible('#outy', 6000, 'Element did not load for specified timeout').getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
      done();
    }, util.doneError(done));
  });
  it('should use @_waitVisible@negative@ method for element present but not visible', function (done) {

    var start;
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    nemo.view._waitVisible('#outy', 3000, 'Element did not load for specified timeout').then(function (find) {
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
  it('should use @_waitVisible@negative@ method for element not present ', function (done) {

    var start;
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    nemo.view._waitVisible('#foo.bar.brrao', 3000, 'Element did not load for specified timeout').then(function (find) {
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
  it('should use @_firstVisible@positive@ method to find an element which isnt initially visible', function (done) {
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo);
    nemo.view.simple.waitButton().click();
    nemo.view._firstVisible({
      'idontexist': '#idontexist',
      'outy': '#outy',
      'noexisty': '#noexisty',
      'alsonoexisty': '#alsonoexisty'
    }, 6000).then(function (foundElement) {
      assert.equal(foundElement, 'outy');
      done();
    }, util.doneError(done));
  });
  it('should use @_firstVisible@negative@ method to throw error when no elements found', function (done) {
    var start;
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    nemo.view._firstVisible({
      'idontexist': '#idontexist',
      'noexisty': '#noexisty',
      'alsonoexisty': '#alsonoexisty'
    }, 3000).then(function (foundElement) {
      done(new Error('shouldnt have found an element'));
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
});