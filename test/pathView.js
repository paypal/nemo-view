/* global describe,before,after,beforeEach,it */
'use strict';

const assert = require('assert');

var Nemo = require('nemo-core'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {};

describe('nemo-view @pathViewSuite@', function () {
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

  it('should use the form view to enter values and write to outy div @useView@', async function () {
    await nemo.view.sub.form.fooText().sendKeys('foo');
    await nemo.view.sub.form.fooButton().click();
    await nemo.view.sub.form.barText().sendKeys('bar');
    await nemo.view.sub.form.barButton().click();
    await nemo.view.sub.form.bingText().sendKeys('bing');
    await nemo.view.sub.form.bingButton().click();
    await nemo.view.sub.form.bangText().sendKeys('bang');
    await nemo.view.sub.form.bangButton().click();
    await nemo.view.sub.form.outBox().getText().then(function (outText) {
      assert.equal(outText, 'foobarbingbang')
    })
  });

});
