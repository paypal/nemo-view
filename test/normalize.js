/* global describe,before,after,it */
'use strict';

var Nemo = require('nemo-core'),
  path = require('path'),
  normalize = require(path.resolve(__dirname, '../lib/normalize')),
  assert = require('assert'),
  nemo = {};

describe('nemo-view @normalize@ module', function () {
  before(async function () {
    nemo = await Nemo();
  });
  after(async function () {
    await nemo.driver.quit();
  });


  it('should correctly convert strings and objects to selenium-webdriver locator functions', async function () {
    var output,
        Locator = nemo.wd.By.id('xyz').constructor,
        verifications = [
      {
        input: {
          type: 'xpath',
          locator: '/x/y/z:[abc]'
        },
        output: { using: 'xpath', value: '/x/y/z:[abc]' }
      }, {
        input: 'xpath:/x/y/z:[abc]',
        output: nemo.wd.By.xpath('/x/y/z:[abc]')

      }, {
        input: 'a span[class=foo]:nth-child',
        output: nemo.wd.By.css('a span[class=foo]:nth-child')

      }, {
        input: 'css:a span[class=foo]:nth-child',
        output: nemo.wd.By.css('a span[class=foo]:nth-child')
      }
    ];
    verifications.forEach(function (verification) {
      output = normalize(nemo, verification.input);
      assert.deepEqual(verification.output, output);
      assert(output instanceof Locator, 'Expected normalized locator to be an instance of Locator');
    });
  });

  it('should return unmodified input object if it is already a locator', async function () {
    var inputLocator = nemo.wd.By.id('xyz');
    var outputLocator = normalize(nemo, inputLocator);
    assert(inputLocator === outputLocator, 'expected output locator to be the input object');
  });

  it('should correctly throw error @notype@', async function () {
    var noType = {
      "noType": {
        "locator": "foo"
      }
    };

    let err;
    try {
      normalize(nemo, noType);
    } catch (e) {
      err = e
    } finally {
      assert(err, 'Expected error for locator with no type')
    }
  });
  it('should correctly throw error @emptyType@', async function () {
    var emptyType = {
      "noType": {
        "locator": "foo",
        "type": ""
      }
    };

    let err;
    try {
      normalize(nemo, emptyType);
    } catch (e) {
      err = e
    } finally {
      assert(err, 'Expected error for locator with empty type')
    }
  });
  it('should correctly throw error @blankType@', async function () {
    var blankType = {
      "noType": {
        "locator": "foo",
        "type": "  "
      }
    };
    let err;
    try {
      normalize(nemo, blankType);
    } catch (e) {
      err = e
    } finally {
      assert(err, 'Expected error for locator with blank type')
    }
  });
  it('should correctly throw error @invalidType@', async function () {
    var invalidType = {
      "noType": {
        "locator": "foo",
        "type": "bar"
      }
    };
    let err;
    try {
      normalize(nemo, invalidType);
    } catch (e) {
      err = e
    } finally {
      assert(err, 'Expected error for locator with invalid type')
    }
  });
  it('should correctly throw error @noLocatorValidType@', async function () {
    var noLocatorValidType = {
      "noType": {
        "type": "css"
      }
    };
    let err;
    try {
      normalize(nemo, noLocatorValidType);
    } catch (e) {
      err = e
    } finally {
      assert(err, 'Expected error for no locator with valid type')
    }
  });
  it('should correctly throw error @noLocatorInvalidType@', async function () {
    var noLocatorInvalidType = {
      "noType": {
        "type": "bar"
      }
    };

    let err;
    try {
      normalize(nemo, noLocatorInvalidType);
    } catch (e) {
      err = e
    } finally {
      assert(err, 'Expected error for locator with invalid type')
    }
  });
});
