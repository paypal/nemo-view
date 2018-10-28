/* global before,after,describe,beforeEach,it */
'use strict';

var Nemo = require('nemo-core'),
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
    }, util.doneError(done));
  });

  it('should NOT select option by @OptionValue@negative@ method', function (done) {
    nemo.view.select.selectOptionValue('does not exist').then(function () {
      done(new Error('Correct option was not selected'));
    }, util.doneSuccess(done));
  });

  it('should select option by @OptionText@positive@ method', function (done) {
    nemo.view.select.selectOptionText('Value of 2');
    nemo.view.select.select().getAttribute('value').then(function (value) {
      assert.equal(value,'2');
      done();
    }, util.doneError(done));
  });

  it('should NOT select option by @OptionText@negative@ method', function (done) {
    nemo.view.select.selectOptionText('does not exist').then(function () {
      done(new Error('Correct option was not selected'));
    }, util.doneSuccess(done));
  });

  it('should select option by @_optionValue@positive@ method', function (done) {
    nemo.view._optionValue('#selectWithValues', 2);
    nemo.view._find('#selectWithValues').getAttribute('value').then(function (value) {
      assert.equal(value, '2');
      done();
    }, util.doneError(done));
  });

  it('should select option by @_optionValue@withParent@positive method', function (done) {
    nemo.view._optionValue('#selectWithValues', 2, nemo.view.select.selectParent());
    nemo.view._find('#selectWithValues').getAttribute('value').then(function (value) {
      assert.equal(value, '2');
      done();
    }, util.doneError(done));
  });

  it('should NOT select option by @_optionValue@negative@ method', function (done) {
    nemo.view._optionValue('#selectWithValues', 'does not exist').then(function () {
      done(new Error('Correct option was not selected'));
    }, util.doneSuccess(done));
  });

  it('should NOT select option by @_optionValue@withParent@negative method', function (done) {
    nemo.view._optionValue('#selectWithValues', 'does not exist', nemo.view.select.selectParent())
    .then(function () {
      done(new Error('Correct option was not selected'));
    }, util.doneSuccess(done));
  });

  it('should select option by  @_optionText@positive@ method', function (done) {
    nemo.view._optionText('#selectWithValues', 'Value of 2');
    nemo.view._find('#selectWithValues').getAttribute('value').then(function (value) {
      assert.equal(value, '2');
      done();
    }, util.doneError(done));
  });

  it('should select option by @_optionText@withParent@positive method', function (done) {
    nemo.view._optionText('#selectWithValues', 'Value of 2', nemo.view.select.selectParent());
    nemo.view._find('#selectWithValues').getAttribute('value').then(function (value) {
      assert.equal(value, '2');
      done();
    }, util.doneError(done));
  });

  it('should NOT select option by @_optionText@negative@ method', function (done) {
    nemo.view._optionText('#selectWithValues', 'does not exist').then(function () {
      done(new Error('Correct option was not selected'));
    }, util.doneSuccess(done));
  });

  it('should NOT select option by @_optionText@withParent@negative method', function (done) {
    nemo.view._optionText('#selectWithValues', 'does not exist', nemo.view.select.selectParent()).then(function () {
      done(new Error('Correct option was not selected'));
    }, util.doneSuccess(done));
  });
});
