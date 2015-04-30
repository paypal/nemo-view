/* global before,after,describe,beforeEach,it */
'use strict';

var Nemo = require('nemo'),
  nemo = {},
  path = require('path'),
  assert = require('assert'),
  util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @select@', function () {
  before(function(done) {
    nemo = Nemo(done);
  });
  after(function(done) {
    nemo.driver.quit().then(done);
  });

  beforeEach(function (done) {
    nemo.driver.get(nemo.data.baseUrl + '/selects');
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });
  it('should select option by @OptionValue@positive@ method', function (done) {
    nemo.view.select.selectOptionValue('2');
    nemo.view.select.select().getAttribute('value').then(function (value) {
      assert.equal(value,'2');
      done();
    });
  });
  it('should NOT select option by @OptionValue@negative@ method', function (done) {
    nemo.view.select.selectOptionValue('does not exist').then(function () {
      done(new Error('Correct option was not selected'));
    }, function (err) {
      done();
    });
  });
  it('should select option by @OptionText@positive@ method', function (done) {
    nemo.view.select.selectOptionText('Value of 2');
    nemo.view.select.select().getAttribute('value').then(function (value) {
      assert.equal(value,'2');
      done();
    });
  });
  it('should NOT select option by @OptionText@negative@ method', function (done) {
    nemo.view.select.selectOptionText('does not exist').then(function () {
      done(new Error('Correct option was not selected'));
    }, function (err) {
      done();
    });
  });
});