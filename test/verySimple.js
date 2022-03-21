/* global describe,before,after,beforeEach,it */
'use strict';

var Nemo = require('nemo-core'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  assert = require('assert'),
  nemo = {};

describe('nemo-view @verySimple@', function () {
  before(async function () {
    nemo = await Nemo();
  });
  after(async function () {
    await nemo.driver.quit();
  });

  beforeEach(async function () {
    await nemo.driver.get(nemo.data.baseUrl);
    await util.waitForJSReady(nemo);
  });
  it('should use the form view to enter values and write to outy div @useView@', async function () {
    await nemo.view._find('css:#outy').getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
    });
    await nemo.view._finds('body').then(function (bodyArray) {
      return bodyArray[0].getTagName();
    }).then(function (tn) {
      assert.equal(tn.toLowerCase(), 'body');
    });
  });
});
