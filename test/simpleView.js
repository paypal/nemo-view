/* global describe,before,after,beforeEach,it */
'use strict';

var Nemo = require('nemo-core'),
  nemo = {},
  path = require('path'),
  assert = require('assert'),
  util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @simpleViewSuite@', function () {
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
  it('should use the form view to enter values and write to outy div @useView@', async function() {
    await nemo.view.form.fooText().sendKeys('foo');
    await nemo.driver.sleep(300);
    await nemo.view.form.fooButton().click();
    await nemo.view.form.barText().sendKeys('bar');
    await nemo.view.form.barButton().click();
    await nemo.view.form.bingText().sendKeys('bing');
    await nemo.view.form.bingButton().click();
    await nemo.view.form.bangText().sendKeys('bang');
    await nemo.view.form.bangButton().click();
    await nemo.driver.sleep(3000);
    await nemo.view.form.outBox().getText().then(function (outText) {
      assert.equal(outText, 'foobarbingbang');
    });
  });
});
