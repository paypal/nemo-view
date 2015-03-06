/* global describe,beforeEach,it */
'use strict';

var nemoFactory = require('nemo-mocha-factory'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  plugins = require('./plugins'),
  nemo = {},
  setup = {
    'view': [
      {'name': 'form', 'locator': 'path:locator/sub/form'}
    ]
  };

describe('nemo-view @pathViewSuite@', function () {
  nemoFactory({'context': nemo, 'plugins': plugins, 'setup': setup});
  beforeEach(function (done) {
    nemo.driver.get(nemo.props.targetBaseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });

  it('should use the form view to enter values and write to outy div @useView@', function (done) {
    nemo.view.form.fooText().sendKeys('foo');
    nemo.view.form.fooButton().click();
    nemo.view.form.barText().sendKeys('bar');
    nemo.view.form.barButton().click();
    nemo.view.form.bingText().sendKeys('bing');
    nemo.view.form.bingButton().click();
    nemo.view.form.bangText().sendKeys('bang');
    nemo.view.form.bangButton().click();
    nemo.view.form.outBox().getText().then(function (outText) {
      if (outText !== 'foobarbingbang') {
        done(new Error('didnt get what we shoulda'));
      } else {
        done();
      }
    }, function (err) {
      done(err);
    });
  });

});