/* global describe,before,after,beforeEach,it */
'use strict';

var Nemo = require('nemo-core'),
  nemo = {},
  path = require('path'),
  assert = require('assert'),
  util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @locale@', function () {
  before(function (done) {
    nemo = Nemo({
      plugins: {
        view: {
          module: 'path:../',
          arguments: ['path:mocks/locale']
        }
      }
    }, done);
  });
  after(function (done) {
    nemo.driver.quit().then(done);
  });
  beforeEach(function (done) {
    nemo.driver.get(nemo.data.baseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });
  it('works for standard locators', function (done) {
    nemo.view.form.text().getAttribute('id').then(function (idValue) {
      assert.equal(idValue, 'foo_text');
      nemo._config.set('data:locale', 'DE');
    }).then(function () {
      return nemo.view.form.text().getAttribute('id');
    }).then(function (idValue) {
      assert.equal(idValue, 'bar_text');
      nemo._config.set('data:locale', '');
    }).then(function () {
      return nemo.view.form.text().getAttribute('id');
    }).then(function (idValue) {
      assert.equal(idValue, 'foo_text');
      done();
    });
  });
  it('works for Elements with inner locale scope', function (done) {
    nemo.view.form.boxInnerLocale().then(function (elts) {
      return elts[0].elt().getAttribute('type').then(function (typeValue) {
        assert.equal(typeValue, 'text');
        nemo._config.set('data:locale', 'DE');
        return elts[0].elt().getAttribute('type');
      });
    }).then(function (typeValue) {
      assert.equal(typeValue, 'button');
      done();
    });
  });
  it('works for Elements with outer locale scope', function (done) {
    nemo._config.set('data:locale', null);
    nemo.view.form.boxOuterLocale().then(function (elts) {
      elts[0].elt().getAttribute('id').then(function (idValue) {
        assert.equal(idValue, 'foo_text');
        return true;
      });
    }).then(function (typeValue) {
      nemo._config.set('data:locale', 'DE');
      nemo.view.form.boxOuterLocale().then(function (elts) {
        elts[0].elt().getAttribute('id').then(function (idValue) {
          assert.equal(idValue, 'bar_text');
          done();
        });
      });
    });
  });
});
