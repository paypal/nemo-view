/* global describe,before,after,beforeEach,it */

'use strict';

var path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  Nemo = require('nemo-core'),
  nemo = {};

describe('nemo-view @listViewSuite@', function () {
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
