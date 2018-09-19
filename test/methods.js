/* global describe,before,after,beforeEach,it */
'use strict';

var assert = require('assert'),
    nemo,
    Nemo = require('nemo-core'),
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
    nemo.view.simple.bodyTag.wait(3000, 'didnt find body tag').getTagName().then(function (tn) {
      if (tn.toLowerCase() !== 'body') {
        done(new Error('something went wrong here'));
      }
    });
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
    nemo.view.simple.outBox.waitVisible();
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
  it('should return true/false using @Visible@Positive@ method when element present', function (done) {
    nemo.view.simple.outBoxVisible().then(function (visible) {
      assert.equal(visible, false);
    });
    nemo.view.simple.outBox.visible().then(function (visible) {
      assert.equal(visible, false);
    });
    nemo.view.form.fooButtonVisible().then(function (visible) {
      assert.equal(visible, true);
    }).then(util.doneSuccess(done), util.doneError(done));
  });
  it('should throw error using @Visible@Negative@ method when element not present', function (done) {
    nemo.view.simple.notExistVisible().then(util.doneError(done), util.doneSuccess(done));
  });
  it('should return true using @Present@Positive@ method', function (done) {
    nemo.view.simple.outBox.present().then(function (present) {
      assert.equal(present, true);
    });
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
  it('should return true using @TextEquals@Positive@ method', function (done) {
    nemo.view.simple.pageHeader.textEquals('Sample form stuff').then(function (isEqual) {
      assert.equal(isEqual, true);
    });
    nemo.view.simple.pageHeaderTextEquals('Sample form stuff').then(function (isEqual) {
      assert.equal(isEqual, true);
      done();
    }, util.doneError(done));
  });
  it('should return false using @TextEquals@negative@ method', function (done) {
    nemo.view.simple.pageHeaderTextEquals('form stuff').then(function () {
      done(new Error('this promise should have been rejected'));
    }, function (err) {
      done();
    });
  });
  it('should return true using @AttrEquals@Positive@ method', function (done) {
    nemo.view.simple.buttonLabel.attrEquals('value', 'Go foo').then(function (isEqual) {
      assert.equal(isEqual, true);
    });
    nemo.view.simple.buttonLabelAttrEquals('value', 'Go foo').then(function (isEqual) {
      assert.equal(isEqual, true);
      done();
    }, util.doneError(done));
  });
  it('should return false using @AttrEquals@negative@ method', function (done) {
    nemo.view.simple.buttonLabelAttrEquals('value', 'foo').then(function () {
      done(new Error('this promise should have been rejected'));
    }, function (err) {
      done();
    });
  });
  //GENERIC methods
  it('should resolve true if element exists @_present@positive@ method', function (done) {
    nemo.view._present('body').then(function (found) {
      if (found) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should resolve true if element exists @_present@withParent@positive@ method', function (done) {
    nemo.view._present('label[for="foo_text"]', nemo.view.simple.form()).then(function (found) {
      if (found) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });


  it('should resolve false if element doesn\'t exists @_present@negative@ method', function (done) {
    nemo.view._present('booody').then(function (found) {
      if (!found) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should resolve false if element does not exists @_present@withParent@negative@ method', function (done) {
    nemo.view._present('boooddy', nemo.view.simple.form()).then(function (found) {
      if (found) {
        done(new Error('something went wrong here'));
      } else {
        done();
      }
    }, util.doneError(done));
  });
  it('should resolve true if element visible @_visible@positive@ method', function (done) {
    nemo.view._visible('body').then(function (visible) {
      if (visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should resolve true if element visible @_visible@withParent@positive@ method', function (done) {
    nemo.view._visible('label[for="foo_text"]', nemo.view.simple.form()).then(function (visible) {
      if (visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should resolve false if element not visible @_visible@negative@ method', function (done) {
    nemo.view._visible('id:outy').then(function (visible) {
      if (!visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should resolve false if element not visible @_visible@withParent@negative@ method', function (done) {
    nemo.view._visible('id:outy', nemo.view.simple.form()).then(function (visible) {
      if (!visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should find an existing element using the @_find@positive@ method', function (done) {
    nemo.view._find('body').getTagName().then(function (tn) {
      if (tn.toLowerCase() === 'body') {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should find an existing element using the @_find@withparent@positive@ method', function (done) {
    nemo.view._find('label[for="foo_text"]', nemo.view.simple.form()).then(function (element) {
      element.getText().then(function(text){
        if(text === 'foo Text:') {
          done();
        }
      }, function(err){
        done(new Error('something went wrong here ', err));
      });
    }, util.doneError(done));
  });

  it('should throw error for non-present element with @_find@negative@ method', function (done) {
    nemo.view._find('booody').then(function () {
      done(new Error('should not have found an element'));
    }, util.doneSuccess(done));
  });
  it('should find an array of elements using the @_finds@positive@ method', function (done) {
    nemo.view._finds('input[type=text]').then(function (inputs) {
      var promises = [];
      inputs.forEach(function (input, idx) {
        var inputAndCheck = input.sendKeys('input', idx).then(function () {
          return input.getAttribute('value');
        }).then(function (value) {
          return value;
        });
        promises.push(inputAndCheck);
      });
      return nemo.wd.promise.all(promises);
    }).then(function (returned) {
      assert.deepEqual([
        'input0',
        'input1',
        'input2',
        'input3'
      ], returned);
      done();
    }, util.doneError(done));
  });
  it('should find elements using @_finds@withParent@ method', function (done) {
    nemo.view._finds('div.fielder', nemo.view.simple.form()).then(function (divs) {
      if (divs.length === 4) {
        done();
      }
    }, util.doneError(done));
  });
  it('should find an existing element using the @_wait@positive@ method', function (done) {
    nemo.view._wait('body', 3000).getTagName().then(function (tn) {
      if (tn.toLowerCase() === 'body') {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });
  it('should appropriately use a timeout argument to the @_wait@negative@CustomTimeout@ method in a failure scenario', function (done) {
    var start = Date.now(), msg = 'Element did not load for specified timeout';
    nemo.view._wait('bordy.foo.blarg', 13000, msg).then(function (find) {
      done(new Error('found notExist but should not have'));
    }, function (err) {
      assert.equal(err.message, msg);
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
    var start = Date.now(), msg = 'Element did not load for specified timeout';
    nemo.view._wait('bordy.foo.blarg', 3000, msg).then(function (find) {
      done(new Error('found notExist but should not have'));
    }, function (err) {
      assert.equal(err.message, msg);
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
    nemo.view._waitVisible('#outy', 6000).getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
      done();
    }, util.doneError(done));
  });
  it('should use @_waitVisible@negative@ method for element present but not visible', function (done) {
    var start, msg = 'Element did not load for specified timeout';
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    nemo.view._waitVisible('#outy', 3000, msg).then(function (find) {
      done(new Error('shouldn\'t have found the element to be visible'));
    }, function (err) {
      assert.equal(err.message, msg);
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
    var start, msg = 'Element did not load for specified timeout';
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    nemo.view._waitVisible('#foo.bar.brrao', 3000, msg).then(function (find) {
      done(new Error('shouldn\'t have found the element to be visible'));
    }, function (err) {
      assert.equal(err.message, msg);
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
