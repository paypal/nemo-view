/* global describe,before,after,beforeEach,it */
'use strict';

var assert = require('assert'),
    nemo,
    Nemo = require('nemo-core'),
    path = require('path'),
    util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @methods@', function () {
  before(async function() {
    nemo = await Nemo();
  });

  after(async function() {
    await nemo.driver.quit();
  });

  beforeEach(async function() {
    await nemo.driver.get(nemo.data.baseUrl);
    await util.waitForJSReady(nemo);
  });
  
  it('should return a @locatorObject@', async function () {
    var locator = nemo.view.simple.outBoxBy();
    assert(locator.using,'didnt get back a locator object');
    assert(locator.value,'didnt get back a locator object');
  });
  it('should find an existing element using the @Wait@positive@ method', async function () {
    await nemo.view.simple.bodyTag.wait(3000, 'didnt find body tag').getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'body', 'something went wrong here');
    });
    await nemo.view.simple.bodyTagWait(3000, 'didnt find body tag').getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'body', 'something went wrong here');
    });
  });
  it('should appropriately use a timeout argument to the @Wait@negative@CustomTimeout@ method in a failure scenario', async function () {
    var start = Date.now();
    let err;
    await nemo.view.simple.notExistWait(13000, 'didnt find notExist')
    .catch(error => {err = error})
    .finally(() => {
      if(err){
        var found = Date.now() - start;
        if (found > 13800 || found < 12500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      else {
        assert.fail('found notExist but should not have')
      }
    })

  });
  it('should appropriately use a DIFFERENT timeout argument to the @Wait@negative@CustomTimeout@ method in a failure scenario', async function () {
    var start = Date.now();
    let err;
    await nemo.view.simple.notExistWait(3000, 'didnt find notExist')
    .catch(error => {err = error})
    .finally(() => {
      if(err){
        var found = Date.now() - start;
        if (found > 3800 || found < 2500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      else {
        assert.fail('found notExist but should not have')
      }
    });
    
  });
  it('should use @WaitVisible@positive@ method', async function () {
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo);
    await nemo.view.simple.waitButton().click();
    await nemo.view.simple.outBox.waitVisible();
    await nemo.view.simple.outBoxWaitVisible(6000, 'didnt find outbox').getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
    });
  });
  it('should use @WaitVisible@negative@ method for element present but not visible', async function () {
    var start;
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    let err;
    await nemo.view.simple.outBoxWaitVisible(3000, 'didnt find outbox')
    .catch(error => {err = error})
    .finally(() => {
      if(err){
        var found = Date.now() - start;
        if (found > 3800 || found < 2500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      assert(err, 'shouldn\'t have found the element to be visible')
    })
  });
  it('should use @WaitVisible@negative@ method for element not present ', async function () {
    var start;
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    let err;
    await nemo.view.simple.outBoxWaitVisible(3000, 'didnt find outbox')
    .catch(error => {err = error})
    .finally(() => {
      if(err){
        var found = Date.now() - start;
        if (found > 3800 || found < 2500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      assert(err, 'shouldn\'t have found the element to be visible')
    });
  });
  it('should return true/false using @Visible@Positive@ method when element present', async function () {
    await nemo.view.simple.outBoxVisible().then(function (visible) {
      assert.equal(visible, false);
    });
    await nemo.view.simple.outBox.visible().then(function (visible) {
      assert.equal(visible, false);
    });
    await nemo.view.form.fooButtonVisible().then(function (visible) {
      assert.equal(visible, true);
    });
  });
  it('should return false using @Visible@Negative@ method when element not present', async function () {
    await nemo.view.simple.notExistVisible().then(function (visible) {
      assert.equal(visible, false);
    });
  });
  it('should return true using @Present@Positive@ method', async function () {
    await nemo.view.simple.outBox.present().then(function (present) {
      assert.equal(present, true);
    });
    await nemo.view.simple.outBoxPresent().then(function (present) {
      assert.equal(present, true);
    });
  });
  it('should return false using @Present@negative@ method', async function () {
    await nemo.view.simple.notExistPresent().then(function (present) {
      assert.equal(present, false);
    });
  });
  it('should return true using @TextEquals@Positive@ method', async function () {
    await nemo.view.simple.pageHeader.textEquals('Sample form stuff');
    await nemo.view.simple.pageHeaderTextEquals('Sample form stuff');
  });
  it('should return false using @TextEquals@negative@ method', async function () {
    await nemo.view.simple.pageHeaderTextEquals('form stuff').catch(function (err) {
      assert(err)
    });
  });
  it('should return true using @AttrEquals@Positive@ method', async function () {
    await nemo.view.simple.buttonLabel.attrEquals('value', 'Go foo');
    await nemo.view.simple.buttonLabelAttrEquals('value', 'Go foo');
  });
  it('should return false using @AttrEquals@negative@ method', async function () {
    await nemo.view.simple.buttonLabelAttrEquals('value', 'foo').catch(function (err) {
      assert(err)
    });
  });
  //GENERIC methods
  it('should resolve true if element exists @_present@positive@ method', async function () {
    let found = await nemo.view._present('body');
    assert.ok(found);
  });
  it('should resolve true if element exists @_present@withParent@positive@ method', async function () {
    let found = await nemo.view._present('label[for="foo_text"]', await nemo.view.simple.form());
    assert.ok(found);
  });

  it('should resolve false if element doesn\'t exists @_present@negative@ method', async function () {
    let found = await nemo.view._present('booody');
    assert.ok(!found);
  });

  it('should resolve false if element does not exists @_present@withParent@negative@ method', async function () {
    await nemo.view._present('boooddy', await nemo.view.simple.form()).then(function (found) {
      assert(!found, 'something went wrong here');
    });
  });
  it('should resolve true if element visible @_visible@positive@ method', async function () {
    let visible = await nemo.view._visible('body');
    assert(visible, 'something went wrong here');
  });
  it('should resolve true if element visible @_visible@withParent@positive@ method', async function () {
    let visible = await nemo.view._visible('label[for="foo_text"]', await nemo.view.simple.form());
    assert(visible, 'something went wrong here');
  });
  it('should resolve false if element not visible @_visible@negative@ method', async function () {
    let visible = await nemo.view._visible('id:outy');
    assert(!visible, 'something went wrong here');
  });
  it('should resolve false if element not visible @_visible@withParent@negative@ method', async function () {
    
    let visible = await nemo.view._visible('id:outy', await nemo.view.simple.form());
    assert(!visible, 'something went wrong here');
    
  });
  it('should find an existing element using the @_find@positive@ method', async function () {
    let tn = await nemo.view._find('body').getTagName();
    assert.equal(tn.toLowerCase(), 'body', 'something went wrong here');
  });
  it('should find an existing element using the @_find@withparent@positive@ method', async function () {
    let text = await nemo.view._find('label[for="foo_text"]', await nemo.view.simple.form()).getText();
    assert.equal(text, 'foo Text:', 'something went wrong here');
  });

  it('should throw error for non-present element with @_find@negative@ method', async function () {
    let err;
    await nemo.view._find('booody')
    .catch(error => err = error)
    assert(err, 'something went wrong here')
  });
  it('should find an array of elements using the @_finds@positive@ method', async function () {
    await nemo.view._finds('input[type=text]').then(async function (inputs) {
      var values = [], id = 0;
      for(let input of inputs){
        var inputAndCheck = await input.sendKeys('input', id++).then(function () {
          return input.getAttribute('value');
        });
        values.push(inputAndCheck);
      }
      return values;
    }).then(function (returned) {
      assert.deepEqual([
        'input0',
        'input1',
        'input2',
        'input3'
      ], returned);
    });
  });
  it('should find elements using @_finds@withParent@ method', async function () {
    await nemo.view._finds('div.fielder', await nemo.view.simple.form()).then(function (divs) {
      assert.equal(divs.length, 4)
    });
  });
  it('should find an existing element using the @_wait@positive@ method', async function () {
    await nemo.view._wait('body', 3000).getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'body')
    });
  });
  it('should appropriately use a timeout argument to the @_wait@negative@CustomTimeout@ method in a failure scenario', async function () {
    var start = Date.now(), msg = 'Element did not load for specified timeout';
    
    let err;
    await nemo.view._wait('bordy.foo.blarg', 13000, msg)
    .catch(error => {err = error})
    .finally(() => {
      assert.match(err.message, /Element did not load for specified timeout.*/)
      if(err){
        var found = Date.now() - start;
        if (found > 13800 || found < 12500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      else {
        assert.fail('found notExist but should not have')
      }
    })
  });

  it('should appropriately use a DIFFERENT timeout argument to the @_wait@negative@CustomTimeout@ method in a failure scenario', async function () {
    var start = Date.now(), msg = 'Element did not load for specified timeout';
    let err;
    await nemo.view._wait('bordy.foo.blarg', 3000, msg)
    .catch(error => {err = error})
    .finally(() => {
      assert.match(err.message, /Element did not load for specified timeout.*/)
      if(err){
        var found = Date.now() - start;
        if (found > 3800 || found < 2500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      else {
        assert.fail('found notExist but should not have')
      }
    })
  });
  it('should use @_waitVisible@positive@ method', async function () {
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo);
    await nemo.view.simple.waitButton().click();
    await nemo.view._waitVisible('#outy', 6000).getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
    });
  });
  it('should use @_waitVisible@negative@ method for element present but not visible', async function () {
    var start, msg = 'Element did not load for specified timeout';
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });

    let err;
    await nemo.view._waitVisible('#outy', 3000, msg)
    .catch(error => {err = error})
    .finally(() => {
      assert.equal(msg, err.message)
      if(err){
        var found = Date.now() - start;
        if (found > 3800 || found < 2500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      else {
        assert.fail('found notExist but should not have')
      }
    });
  });
  it('should use @_waitVisible@negative@ method for element not present ', async function () {
    var start, msg = 'Element did not load for specified timeout';
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });

    let err;
    await nemo.view._waitVisible('#foo.bar.brrao', 3000, msg)
    .catch(error => {err = error})
    .finally(() => {
      assert.equal(msg, err.message)
      if(err){
        var found = Date.now() - start;
        if (found > 3800 || found < 2500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      else {
        assert.fail('found notExist but should not have')
      }
    });
  });
  it('should use @_firstVisible@positive@ method to find an element which isnt initially visible', async function () {
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo);
    await nemo.view.simple.waitButton().click();
    await nemo.view._firstVisible({
      'idontexist': '#idontexist',
      'outy': '#outy',
      'noexisty': '#noexisty',
      'alsonoexisty': '#alsonoexisty'
    }, 6000).then(function (foundElement) {
      assert.equal(foundElement, 'outy');
    });
  });
  it('should use @_firstVisible@negative@ method to throw error when no elements found', async function () {
    var start;
    await nemo.driver.get(nemo.data.baseUrl + '/waits');
    await util.waitForJSReady(nemo).then(function () {
      start = Date.now();
    });
    let err;
    await nemo.view._firstVisible({
      'idontexist': '#idontexist',
      'noexisty': '#noexisty',
      'alsonoexisty': '#alsonoexisty'
    }, 3000)
    .catch(error => {err = error})
    .finally(() => {
      if(err){
        var found = Date.now() - start;
        if (found > 3800 || found < 2500) {
          assert.fail('error thrown but in the wrong period of time, ')
        }
      }
      else {
        assert.fail('shouldnt have found an element')
      }
    });
  });
});
