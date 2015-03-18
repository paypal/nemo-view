/* global describe,it */

'use strict';

var Nemo = require('nemo'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {},
  setup = {};
//plugins.plugins.login = {
//  'module': path.resolve(__dirname, 'plugin/shared-fn-plugin'),
//  'register': true
//};

describe('nemo-view @pluginContainedFunctionality@', function () {
  //nemoFactory({'context': nemo, 'plugins': plugins, 'setup': setup});
  it('should complete the shared functionality', function (done) {
    nemo.login.getPage();
    util.waitForJSReady(nemo);
    nemo.login.login('medelman-buyer@paypal.com', '11111111');
    nemo.login.logout().then(util.doneSuccess(done), util.doneError(done));
  });

});