/* global before,after,describe,it */

'use strict';

var Nemo = require('nemo-core'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {};

describe('nemo-view @pluginContainedFunctionality@', function () {
  before(async function() {
    nemo = await Nemo();
  });

  after(async function() {
    await nemo.driver.quit();
  });

  it('should complete the shared functionality', async function () {
    await nemo.login.getPage();
    await util.waitForJSReady(nemo);
    await nemo.login.login('medelman-buyer@paypal.com', '11111111');
    await nemo.login.logout();
  });

});
