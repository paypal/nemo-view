/* global describe,beforeEach,it */

'use strict';

var nemoFactory = require('nemo-mocha-factory'),
  plugins = require('./plugins'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {},
  setup = {
    'view': ['formElementList']
  };

describe('nemo-view @listViewSuite@', function () {
  nemoFactory({'context': nemo, 'plugins': plugins, 'setup': setup});
  beforeEach(function (done) {
    nemo.driver.get(nemo.props.targetBaseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });
  it('should use the form list view to enter values and write to outy div @useListView@', function (done) {
    nemo.view.formElementList.inputGroup().then(function (elts) {
      elts.forEach(function (elt) {
        elt.text().sendKeys('abcd');
        elt.button().click();
      });
      nemo.view.formElementList.outBox().getText().then(function (outText) {
        if (outText === 'abcdabcdabcdabcd') {
          done();
        } else {
          done(new Error('didnt get what we shoulda'));
        }
      }, util.doneError(done));
    });

  });

});