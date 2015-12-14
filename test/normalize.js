/* global describe,before,after,it */
'use strict';

var Nemo = require('nemo'),
  path = require('path'),
  normalize = require(path.resolve(__dirname, '../lib/normalize')),
  assert = require('assert'),
  nemo = {};

describe('nemo-view @normalize@ module', function () {
  before(function (done) {
    nemo = Nemo(done);
  });
  after(function (done) {
    nemo.driver.quit().then(done);
  });


  it('should correctly convert strings and objects to selenium-webdriver locator functions', function (done) {
    var verifications = [{
      'input': {
        type: 'xpath',
        locator: '/x/y/z:[abc]'
      },
      'output': {
        type: 'xpath',
        locator: '/x/y/z:[abc]'
      }
    },
      {
      'input': 'xpath:/x/y/z:[abc]',
      'output': nemo.wd.By.xpath('/x/y/z:[abc]')

    }, {
      'input': 'a span[class=foo]:nth-child',
      'output': nemo.wd.By.css('a span[class=foo]:nth-child')

    }, {
      'input': 'css:a span[class=foo]:nth-child',
      'output': nemo.wd.By.css('a span[class=foo]:nth-child')

    }];
    verifications.forEach(function (verification) {
      assert.deepEqual(verification.output, normalize(nemo, verification.input));
    });
    done();
  });
  it('should correctly throw error @notype@', function (done) {
    var noType = {
      "noType": {
        "locator": "foo"
      }
    };
    try {
      normalize(nemo, noType);
      done(new Error('Expected error for locator with no type'));
    } catch (e) {
      console.log(e);
      done();
    }
  });
  it('should correctly throw error @emptyType@', function (done) {
    var emptyType = {
      "noType": {
        "locator": "foo",
        "type": ""
      }
    };
    try {
      normalize(nemo, emptyType);
      done(new Error('Expected error for locator with empty type'));
    } catch (e) {
      console.log(e);
      done();
    }
  });
  it('should correctly throw error @blankType@', function (done) {
    var blankType = {
      "noType": {
        "locator": "foo",
        "type": "  "
      }
    };
    try {
      normalize(nemo, blankType);
      done(new Error('Expected error for locator with blank type'));
    } catch (e) {
      console.log(e);
      done();
    }
  });
  it('should correctly throw error @invalidType@', function (done) {
    var invalidType = {
      "noType": {
        "locator": "foo",
        "type": "bar"
      }
    };
    try {
      normalize(nemo, invalidType);
      done(new Error('Expected error for locator with invalid type'));
    } catch (e) {
      console.log(e);
      done();
    }
  });
  it('should correctly throw error @noLocatorValidType@', function (done) {
    var noLocatorValidType = {
      "noType": {
        "type": "css"
      }
    };
    try {
      normalize(nemo, noLocatorValidType);
      done(new Error('Expected error for no locator with valid type'));
    } catch (e) {
      console.log(e);
      done();
    }
  });
  it('should correctly throw error @noLocatorInvalidType@', function (done) {
    var noLocatorInvalidType = {
      "noType": {
        "type": "bar"
      }
    };
    try {
      normalize(nemo, noLocatorInvalidType);
      done(new Error('Expected error for locator with invalid type'));
    } catch (e) {
      console.log(e);
      done();
    }
  });
});
