/* global describe,before,after,beforeEach,it */
'use strict';

var Nemo = require('nemo-core'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {};

describe('nemo-view @pathViewSuite@', function () {
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
    nemo.view.sub.form.fooText().sendKeys('foo');
    nemo.view.sub.form.fooButton().click();
    nemo.view.sub.form.barText().sendKeys('bar');
    nemo.view.sub.form.barButton().click();
    nemo.view.sub.form.bingText().sendKeys('bing');
    nemo.view.sub.form.bingButton().click();
    nemo.view.sub.form.bangText().sendKeys('bang');
    nemo.view.sub.form.bangButton().click();
    nemo.view.sub.form.outBox().getText().then(function (outText) {
      if (outText !== 'foobarbingbang') {
        done(new Error('didnt get what we shoulda'));
      } else {
        done();
      }
    }, util.doneError(done));
  });

});
