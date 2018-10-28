/* global describe,before,after,beforeEach,it */
'use strict';

var Nemo = require('nemo-core'),
  nemo = {},
  path = require('path'),
  assert = require('assert'),
  util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @simpleViewSuite@', function () {
  before(function(done) {
    nemo = Nemo(done);
  });
  after(function(done) {
    nemo.driver.quit().then(done);
  });
  beforeEach(function (done) {
    nemo.driver.get(nemo.data.baseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });
  it('should use the form view to enter values and write to outy div @useView@', function (done) {
    nemo.view.form.fooText().sendKeys('foo');
    nemo.driver.sleep(300);
    nemo.view.form.fooButton().click();
    nemo.view.form.barText().sendKeys('bar');
    nemo.view.form.barButton().click();
    nemo.view.form.bingText().sendKeys('bing');
    nemo.view.form.bingButton().click();
    nemo.view.form.bangText().sendKeys('bang');
    nemo.view.form.bangButton().click();
    nemo.driver.sleep(3000);
    nemo.view.form.outBox().getText().then(function (outText) {
      assert.equal(outText, 'foobarbingbang');
      done();
    }, util.doneError(done));
  });
});
