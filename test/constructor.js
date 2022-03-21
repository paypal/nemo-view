/* global describe,it */
'use strict';

var Nemo = require('nemo-core'),
  assert = require('assert'),
  nemo = {};

describe('nemo-view @constructor@', function () {
  it('should do ? with malformed JSON file(s)', async function () {
    let err;
    try {
      nemo = await Nemo({
        'plugins': {
          "view": {
            "module": "path:../",
            "arguments": ["path:mocks/badjson"]
          }
        }
      })
    } catch (error) {
      err = error
    } finally {
      assert(err)
    }

  });
  it('should give back _ methods with empty locator directory', async function () {
    nemo = await Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/empty"]
        }
      }
    });
    assert(nemo.view);
    assert(nemo.view._find);
    await nemo.driver.quit()
  });
  it('should give back _ methods with empty locator directory', async function () {
    nemo = await Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/idontexist"]
        }
      }
    });
    assert(nemo.view);
    assert(nemo.view._find);
    await nemo.driver.quit()
  });
  it('should give back _ methods with no locatorDirectory argument', async function () {
    nemo = await Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": null
        }
      }
    });
    assert(nemo.view);
    assert(nemo.view._find);
    await nemo.driver.quit()
  });
});
