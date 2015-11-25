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
});