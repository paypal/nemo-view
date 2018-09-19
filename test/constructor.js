/* global describe,it */
'use strict';

var Nemo = require('nemo-core'),
  assert = require('assert'),
  nemo = {};

describe('nemo-view @constructor@', function () {
  it('should do ? with malformed JSON file(s)', function (done) {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/badjson"]
        }
      }
    }, function (err) {
      if (err) {
        done();
      } else {
        done(new Error('should have got an error in nemo callback'));
      }
    });
  });
  it('should give back _ methods with empty locator directory', function (done) {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/empty"]
        }
      }
    }, function (err) {
      if (err) {
        done(new Error('shouldnt have got an error in nemo callback'));
      } else {
        assert(nemo.view);
        assert(nemo.view._find);
        done();
      }
      nemo.driver.quit();
    });
  });
  it('should give back _ methods with empty locator directory', function (done) {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/idontexist"]
        }
      }
    }, function (err) {
      if (err) {
        done(new Error('shouldnt have got an error in nemo callback'));
      } else {
        assert(nemo.view);
        assert(nemo.view._find);
        done();
      }
      nemo.driver.quit();
    });
  });
  it('should give back _ methods with no locatorDirectory argument', function (done) {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": null
        }
      }
    }, function (err) {
      if (err) {
        done(new Error('shouldnt have got an error in nemo callback'));
      } else {
        assert(nemo.view);
        assert(nemo.view._find);
        done();
      }
      nemo.driver.quit();
    });
  });
});
